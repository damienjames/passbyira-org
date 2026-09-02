import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github";
import { buildSchema } from "@tinacms/graphql";
import fs from "node:fs";
import path from "node:path";
import { AzureTableLevel } from "./azureTableLevel.js";
import { createBundledBridge } from "./bundledBridge.js";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const allowBuildLocalDb = process.env.TINA_ALLOW_BUILD_LOCAL_DB === "true";
const branch = process.env.GITHUB_BRANCH || process.env.HEAD || "main";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const hasRemoteConfig = Boolean(
  process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO &&
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN &&
    process.env.AZURE_TABLE_CONNECTION_STRING &&
    process.env.AZURE_TABLE_NAME
);

// Build the database — never throw at module evaluation time so that
// import errors are caught by the try/catch in tina/index.js instead
// of crashing the Azure Functions host before our error handler runs.
let database;
let readyPromise = null;

function resolveGeneratedSchemaPath() {
  const candidates = [
    path.join(process.cwd(), "api", "tina", "__generated__", "_schema.json"),
    path.join(process.cwd(), "tina", "__generated__", "_schema.json"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

try {
  if (isLocal || (!hasRemoteConfig && allowBuildLocalDb)) {
    database = createLocalDatabase();
  } else if (hasRemoteConfig) {
    database = createDatabase({
      bridge: createBundledBridge(),
      gitProvider: new GitHubProvider({
        owner: required("GITHUB_OWNER"),
        repo: required("GITHUB_REPO"),
        token: required("GITHUB_PERSONAL_ACCESS_TOKEN"),
        branch,
      }),
      databaseAdapter: new AzureTableLevel({
        connectionString: required("AZURE_TABLE_CONNECTION_STRING"),
        tableName: required("AZURE_TABLE_NAME"),
        partitionKey: process.env.AZURE_TABLE_PARTITION_KEY || `tina_${branch.replace(/[^\w-]/g, "_")}`,
      }),
      namespace: branch,
    });
  } else {
    // Missing env vars — export a proxy that surfaces the error when used
    const missingMsg = "Tina production mode requires GITHUB_OWNER, GITHUB_REPO, GITHUB_PERSONAL_ACCESS_TOKEN, AZURE_TABLE_CONNECTION_STRING, and AZURE_TABLE_NAME.";
    console.error("[tina/database] " + missingMsg);
    database = new Proxy({}, {
      get() { throw new Error(missingMsg); }
    });
  }
} catch (e) {
  console.error("[tina/database] Failed to create database:", e.message);
  database = new Proxy({}, {
    get() { throw e; }
  });
}

async function ensureDatabaseReady() {
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    if (!database?.getGraphQLSchema || !database?.indexContent || !hasRemoteConfig) {
      return database;
    }

    const existingSchema = await database.getGraphQLSchema().catch(() => null);
    if (existingSchema) {
      return database;
    }

    const schemaPath = resolveGeneratedSchemaPath();
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Tina generated schema file not found at ${schemaPath}`);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const generated = await buildSchema({ schema });
    await database.indexContent(generated);
    return database;
  })().catch((error) => {
    readyPromise = null;
    throw error;
  });

  return readyPromise;
}

export { ensureDatabaseReady };
export default database;
