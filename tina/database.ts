import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github";

import { AzureTableLevel } from "./azureTableLevel";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const allowBuildLocalDatabase = process.env.TINA_ALLOW_BUILD_LOCAL_DB === "true";
const branch = process.env.GITHUB_BRANCH || process.env.HEAD || "main";

const hasProductionConfiguration = Boolean(
  process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO &&
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN &&
    process.env.AZURE_TABLE_CONNECTION_STRING &&
    process.env.AZURE_TABLE_NAME,
);

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

if (!isLocal && !allowBuildLocalDatabase && !hasProductionConfiguration) {
  throw new Error(
    "Production TinaCMS requires GitHub credentials and an Azure Table Storage connection.",
  );
}

const database =
  isLocal || (!hasProductionConfiguration && allowBuildLocalDatabase)
    ? createLocalDatabase()
    : createDatabase({
        gitProvider: new GitHubProvider({
          owner: required("GITHUB_OWNER"),
          repo: required("GITHUB_REPO"),
          token: required("GITHUB_PERSONAL_ACCESS_TOKEN"),
          branch,
        }),
        databaseAdapter: new AzureTableLevel<string, Record<string, unknown>>({
          connectionString: required("AZURE_TABLE_CONNECTION_STRING"),
          tableName: required("AZURE_TABLE_NAME"),
          partitionKey:
            process.env.AZURE_TABLE_PARTITION_KEY ||
            `tina_${branch.replace(/[^\w-]/g, "_")}`,
        }),
        namespace: branch,
      });

export default database;
