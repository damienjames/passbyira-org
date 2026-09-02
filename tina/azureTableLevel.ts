import { TableClient } from "@azure/data-tables";
import {
  AbstractIterator,
  AbstractKeyIterator,
  AbstractLevel,
  AbstractValueIterator,
} from "abstract-level";

type RangeOptions = {
  gt?: Buffer;
  gte?: Buffer;
  lt?: Buffer;
  lte?: Buffer;
  limit: number;
  reverse: boolean;
};

type IteratorRow = { key: Buffer; value: Buffer };

type AzureTableLevelOptions = {
  connectionString: string;
  tableName: string;
  partitionKey?: string;
} & Record<string, unknown>;

function levelError(message: string, code?: string) {
  const error = new Error(message) as Error & { code?: string };
  if (code) error.code = code;
  return error;
}

function encodeKey(key: Buffer | Uint8Array | string) {
  const raw = Buffer.isBuffer(key) ? key.toString("utf8") : String(key);
  return Buffer.from(raw.replace(/\\/g, "/")).toString("hex");
}

function decodeKey(rowKey: string) {
  return Buffer.from(rowKey, "hex");
}

const VALUE_CHUNK_SIZE = 30_000;

function encodeEntityValue(value: Buffer | Uint8Array | string) {
  const encoded = (Buffer.isBuffer(value) ? value : Buffer.from(value)).toString("base64");
  if (encoded.length <= VALUE_CHUNK_SIZE) {
    return { value: encoded, valueChunkCount: 1 };
  }

  const entity: Record<string, string | number> = {
    valueChunkCount: Math.ceil(encoded.length / VALUE_CHUNK_SIZE),
  };
  const valueChunkCount = Number(entity.valueChunkCount);
  for (let index = 0; index < valueChunkCount; index += 1) {
    entity[`value${index}`] = encoded.slice(
      index * VALUE_CHUNK_SIZE,
      (index + 1) * VALUE_CHUNK_SIZE,
    );
  }
  return entity;
}

function decodeEntityValue(entity?: Record<string, unknown>) {
  if (!entity) return Buffer.from("");
  if (entity.value) return Buffer.from(String(entity.value), "base64");

  const count = Number(entity.valueChunkCount || 0);
  let encoded = "";
  for (let index = 0; index < count; index += 1) {
    encoded += String(entity[`value${index}`] || "");
  }
  return Buffer.from(encoded, "base64");
}

function inRange(key: Buffer, options: RangeOptions) {
  if (options.gt && Buffer.compare(key, options.gt) <= 0) return false;
  if (options.gte && Buffer.compare(key, options.gte) < 0) return false;
  if (options.lt && Buffer.compare(key, options.lt) >= 0) return false;
  if (options.lte && Buffer.compare(key, options.lte) > 0) return false;
  return true;
}

async function collectRows(
  client: TableClient,
  partitionKey: string,
  options: RangeOptions,
) {
  const rows: IteratorRow[] = [];
  const safePartitionKey = partitionKey.replace(/'/g, "''");
  const entities = client.listEntities<Record<string, unknown>>({
    queryOptions: { filter: `PartitionKey eq '${safePartitionKey}'` },
  });

  for await (const entity of entities) {
    const key = decodeKey(String(entity.rowKey));
    if (!inRange(key, options)) continue;
    rows.push({ key, value: decodeEntityValue(entity) });
  }

  rows.sort((left, right) => Buffer.compare(left.key, right.key));
  if (options.reverse) rows.reverse();
  return options.limit > 0 ? rows.slice(0, options.limit) : rows;
}

class AzureTableIterator<KDefault, VDefault> extends AbstractIterator<
  AzureTableLevel<KDefault, VDefault>,
  KDefault,
  VDefault
> {
  private readonly rowsPromise: Promise<IteratorRow[]>;
  private index = 0;

  constructor(db: AzureTableLevel<KDefault, VDefault>, options: RangeOptions) {
    super(db, options as never);
    this.rowsPromise = collectRows(db.client, db.partitionKey, options);
  }

  async _next(callback: (error?: Error | null, key?: KDefault, value?: VDefault) => void) {
    const row = (await this.rowsPromise)[this.index++];
    if (!row) return this.db.nextTick(callback);
    callback(null, row.key as KDefault, row.value as VDefault);
  }
}

class AzureTableKeyIterator<KDefault, VDefault> extends AbstractKeyIterator<
  AzureTableLevel<KDefault, VDefault>,
  KDefault
> {
  private readonly rowsPromise: Promise<IteratorRow[]>;
  private index = 0;

  constructor(db: AzureTableLevel<KDefault, VDefault>, options: RangeOptions) {
    super(db, options as never);
    this.rowsPromise = collectRows(db.client, db.partitionKey, options);
  }

  async _next(callback: (error?: Error | null, key?: KDefault) => void) {
    const row = (await this.rowsPromise)[this.index++];
    if (!row) return this.db.nextTick(callback);
    callback(null, row.key as KDefault);
  }
}

class AzureTableValueIterator<KDefault, VDefault> extends AbstractValueIterator<
  AzureTableLevel<KDefault, VDefault>,
  KDefault,
  VDefault
> {
  private readonly rowsPromise: Promise<IteratorRow[]>;
  private index = 0;

  constructor(db: AzureTableLevel<KDefault, VDefault>, options: RangeOptions) {
    super(db, options as never);
    this.rowsPromise = collectRows(db.client, db.partitionKey, options);
  }

  async _next(callback: (error?: Error | null, value?: VDefault) => void) {
    const row = (await this.rowsPromise)[this.index++];
    if (!row) return this.db.nextTick(callback);
    callback(null, row.value as VDefault);
  }
}

export class AzureTableLevel<
  KDefault = string,
  VDefault = string,
> extends AbstractLevel<Buffer | Uint8Array | string, KDefault, VDefault> {
  readonly connectionString: string;
  readonly tableName: string;
  readonly partitionKey: string;
  client!: TableClient;

  constructor(options: AzureTableLevelOptions) {
    super({ encodings: { utf8: true } }, options as never);
    this.connectionString = String(options.connectionString || "");
    this.tableName = String(options.tableName || "");
    this.partitionKey = String(options.partitionKey || "tina");
  }

  get type() {
    return "azure-table-level";
  }

  async _open(_options: Record<string, unknown>, callback: (error?: Error | null) => void) {
    if (!this.connectionString) {
      return this.nextTick(
        callback,
        levelError("connectionString is required", "AZURE_TABLE_CONNECTION_STRING_REQUIRED"),
      );
    }
    if (!this.tableName) {
      return this.nextTick(callback, levelError("tableName is required", "AZURE_TABLE_NAME_REQUIRED"));
    }

    this.client = TableClient.fromConnectionString(this.connectionString, this.tableName);
    try {
      await this.client.createTable();
    } catch (error) {
      const message = String((error as { message?: string }).message || "");
      if (!message.includes("TableAlreadyExists")) {
        return this.nextTick(callback, levelError(message || "Unable to open Azure Table adapter"));
      }
    }
    this.nextTick(callback);
  }

  async _close(callback: (error?: Error | null) => void) {
    this.nextTick(callback);
  }

  async _put(
    key: Buffer,
    value: Buffer,
    _options: Record<string, unknown>,
    callback: (error?: Error | null) => void,
  ) {
    try {
      await this.client.upsertEntity(
        {
          partitionKey: this.partitionKey,
          rowKey: encodeKey(key),
          ...encodeEntityValue(value),
        },
        "Replace",
      );
      this.nextTick(callback);
    } catch (error) {
      this.nextTick(callback, levelError(String((error as { message?: string }).message || error)));
    }
  }

  async _get(
    key: Buffer,
    _options: Record<string, unknown>,
    callback: (error?: Error | null, value?: Buffer) => void,
  ) {
    try {
      const entity = await this.client.getEntity<Record<string, unknown>>(
        this.partitionKey,
        encodeKey(key),
      );
      this.nextTick(callback, null, decodeEntityValue(entity));
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode === 404) {
        return this.nextTick(callback, levelError("Key was not found", "LEVEL_NOT_FOUND"));
      }
      this.nextTick(callback, levelError(String((error as { message?: string }).message || error)));
    }
  }

  async _del(
    key: Buffer,
    _options: Record<string, unknown>,
    callback: (error?: Error | null) => void,
  ) {
    try {
      await this.client.deleteEntity(this.partitionKey, encodeKey(key));
      this.nextTick(callback);
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode === 404) return this.nextTick(callback);
      this.nextTick(callback, levelError(String((error as { message?: string }).message || error)));
    }
  }

  async _batch(
    batch: Array<{ type: "put" | "del"; key: Buffer; value?: Buffer }>,
    _options: Record<string, unknown>,
    callback: (error?: Error | null) => void,
  ) {
    try {
      for (const operation of batch) {
        if (operation.type === "put" && operation.value) {
          await this.client.upsertEntity(
            {
              partitionKey: this.partitionKey,
              rowKey: encodeKey(operation.key),
              ...encodeEntityValue(operation.value),
            },
            "Replace",
          );
        } else if (operation.type === "del") {
          try {
            await this.client.deleteEntity(this.partitionKey, encodeKey(operation.key));
          } catch (error) {
            if ((error as { statusCode?: number }).statusCode !== 404) throw error;
          }
        }
      }
      this.nextTick(callback);
    } catch (error) {
      this.nextTick(callback, levelError(String((error as { message?: string }).message || error)));
    }
  }

  async _clear(options: RangeOptions, callback: (error?: Error | null) => void) {
    try {
      const rows = await collectRows(this.client, this.partitionKey, options);
      for (const row of rows) {
        await this.client.deleteEntity(this.partitionKey, encodeKey(row.key));
      }
      this.nextTick(callback);
    } catch (error) {
      const typedError = error as { statusCode?: number; code?: string; message?: string };
      if (typedError.statusCode === 404 || typedError.code === "ResourceNotFound") {
        return this.nextTick(callback);
      }
      this.nextTick(callback, levelError(String(typedError.message || error)));
    }
  }

  _iterator(options: RangeOptions) {
    return new AzureTableIterator(this, options);
  }

  _keys(options: RangeOptions) {
    return new AzureTableKeyIterator(this, options);
  }

  _values(options: RangeOptions) {
    return new AzureTableValueIterator(this, options);
  }
}
