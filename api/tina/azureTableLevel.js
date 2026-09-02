import { TableClient } from "@azure/data-tables";
import { AbstractIterator, AbstractKeyIterator, AbstractLevel, AbstractValueIterator } from "abstract-level";

function makeError(message, code) {
  const error = new Error(message);
  if (code) error.code = code;
  return error;
}

function encodeKey(key) {
  const raw = Buffer.isBuffer(key) ? key.toString("utf8") : String(key);
  return Buffer.from(raw.replace(/\\/g, "/")).toString("hex");
}

function decodeKey(rowKey) {
  return Buffer.from(rowKey, "hex");
}

function decodeValue(value) {
  return Buffer.from(value || "", "base64");
}

const VALUE_CHUNK_SIZE = 30000;

function encodeEntityValue(value) {
  const normalized = Buffer.isBuffer(value) ? value : Buffer.from(value);
  const encoded = normalized.toString("base64");
  if (encoded.length <= VALUE_CHUNK_SIZE) {
    return {
      value: encoded,
      valueChunkCount: 1,
    };
  }

  const entity = {
    valueChunkCount: Math.ceil(encoded.length / VALUE_CHUNK_SIZE),
  };
  for (let i = 0; i < entity.valueChunkCount; i += 1) {
    entity[`value${i}`] = encoded.slice(i * VALUE_CHUNK_SIZE, (i + 1) * VALUE_CHUNK_SIZE);
  }
  return entity;
}

function decodeEntityValue(entity) {
  if (!entity) return Buffer.from("");
  if (entity.value) return decodeValue(entity.value);
  const chunkCount = Number(entity.valueChunkCount || 0);
  if (!chunkCount) return Buffer.from("");
  let combined = "";
  for (let i = 0; i < chunkCount; i += 1) {
    combined += String(entity[`value${i}`] || "");
  }
  return decodeValue(combined);
}

function compareBuffers(a, b) {
  const left = Buffer.isBuffer(a) ? a : Buffer.from(a);
  const right = Buffer.isBuffer(b) ? b : Buffer.from(b);
  return Buffer.compare(left, right);
}

function inRange(key, options) {
  if (options.gt && compareBuffers(key, options.gt) <= 0) return false;
  if (options.gte && compareBuffers(key, options.gte) < 0) return false;
  if (options.lt && compareBuffers(key, options.lt) >= 0) return false;
  if (options.lte && compareBuffers(key, options.lte) > 0) return false;
  return true;
}

async function collectRows(client, partitionKey, options) {
  const rows = [];
  const entities = client.listEntities({
    queryOptions: {
      filter: `PartitionKey eq '${partitionKey}'`,
    },
  });

  for await (const entity of entities) {
    const key = decodeKey(String(entity.rowKey));
    if (!inRange(key, options)) continue;
    rows.push({ key, value: decodeEntityValue(entity) });
  }

  rows.sort((a, b) => compareBuffers(a.key, b.key));
  if (options.reverse) rows.reverse();
  return options.limit > 0 ? rows.slice(0, options.limit) : rows;
}

class AzureTableIterator extends AbstractIterator {
  constructor(db, options) {
    super(db, options);
    this.rowsPromise = collectRows(db.client, db.partitionKey, options);
    this.index = 0;
  }

  async _next(callback) {
    const rows = await this.rowsPromise;
    const row = rows[this.index++];
    if (!row) return this.db.nextTick(callback);
    callback(null, row.key, row.value);
  }
}

class AzureTableKeyIterator extends AbstractKeyIterator {
  constructor(db, options) {
    super(db, options);
    this.rowsPromise = collectRows(db.client, db.partitionKey, options);
    this.index = 0;
  }

  async _next(callback) {
    const rows = await this.rowsPromise;
    const row = rows[this.index++];
    if (!row) return this.db.nextTick(callback);
    callback(null, row.key);
  }
}

class AzureTableValueIterator extends AbstractValueIterator {
  constructor(db, options) {
    super(db, options);
    this.rowsPromise = collectRows(db.client, db.partitionKey, options);
    this.index = 0;
  }

  async _next(callback) {
    const rows = await this.rowsPromise;
    const row = rows[this.index++];
    if (!row) return this.db.nextTick(callback);
    callback(null, row.value);
  }
}

class AzureTableLevel extends AbstractLevel {
  constructor(options) {
    super({ encodings: { utf8: true } }, options);
    this.connectionString = String(options.connectionString || "");
    this.tableName = String(options.tableName || "");
    this.partitionKey = String(options.partitionKey || "tina");
  }

  get type() {
    return "azure-table-level";
  }

  async _open(_options, callback) {
    if (!this.connectionString) {
      return this.nextTick(callback, makeError("connectionString is required", "AZURE_TABLE_CONNECTION_STRING_REQUIRED"));
    }
    if (!this.tableName) {
      return this.nextTick(callback, makeError("tableName is required", "AZURE_TABLE_NAME_REQUIRED"));
    }

    this.client = TableClient.fromConnectionString(this.connectionString, this.tableName);
    try {
      await this.client.createTable();
    } catch (error) {
      const message = String((error && error.message) || "");
      if (!message.includes("TableAlreadyExists")) {
        return this.nextTick(callback, makeError(message || "Unable to open Azure Table adapter"));
      }
    }
    this.nextTick(callback);
  }

  async _close(callback) {
    this.nextTick(callback);
  }

  async _put(key, value, _options, callback) {
    try {
      await this.client.upsertEntity({
        partitionKey: this.partitionKey,
        rowKey: encodeKey(key),
        ...encodeEntityValue(value),
      }, "Replace");
      this.nextTick(callback);
    } catch (error) {
      this.nextTick(callback, makeError(String((error && error.message) || error)));
    }
  }

  async _get(key, _options, callback) {
    try {
      const entity = await this.client.getEntity(this.partitionKey, encodeKey(key));
      this.nextTick(callback, null, decodeEntityValue(entity));
    } catch (error) {
      if (error && error.statusCode === 404) {
        return this.nextTick(callback, makeError(`Key ${key.toString("hex")} was not found`, "LEVEL_NOT_FOUND"));
      }
      this.nextTick(callback, makeError(String((error && error.message) || error)));
    }
  }

  async _del(key, _options, callback) {
    try {
      await this.client.deleteEntity(this.partitionKey, encodeKey(key));
      this.nextTick(callback);
    } catch (error) {
      if (error && error.statusCode === 404) return this.nextTick(callback);
      this.nextTick(callback, makeError(String((error && error.message) || error)));
    }
  }

  async _batch(batch, _options, callback) {
    try {
      for (const op of batch) {
        if (op.type === "put" && op.value) {
          await this.client.upsertEntity({
            partitionKey: this.partitionKey,
            rowKey: encodeKey(op.key),
            ...encodeEntityValue(op.value),
          }, "Replace");
        } else if (op.type === "del") {
          try {
            await this.client.deleteEntity(this.partitionKey, encodeKey(op.key));
          } catch (error) {
            if (!(error && error.statusCode === 404)) throw error;
          }
        }
      }
      this.nextTick(callback);
    } catch (error) {
      this.nextTick(callback, makeError(String((error && error.message) || error)));
    }
  }

  async _clear(options, callback) {
    try {
      const rows = await collectRows(this.client, this.partitionKey, options);
      for (const row of rows) {
        await this.client.deleteEntity(this.partitionKey, encodeKey(row.key));
      }
      this.nextTick(callback);
    } catch (error) {
      if ((error && error.statusCode === 404) || (error && error.code === "ResourceNotFound")) {
        return this.nextTick(callback);
      }
      this.nextTick(callback, makeError(String((error && error.message) || error)));
    }
  }

  _iterator(options) {
    return new AzureTableIterator(this, options);
  }

  _keys(options) {
    return new AzureTableKeyIterator(this, options);
  }

  _values(options) {
    return new AzureTableValueIterator(this, options);
  }
}

export { AzureTableLevel };
