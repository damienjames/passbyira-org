import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const sourceDir = path.join(ROOT, "tina", "__generated__");
const targetDir = path.join(ROOT, "api", "tina", "__generated__");
const contentSourceDir = path.join(ROOT, "content");
const contentTargetDir = path.join(ROOT, "api", "content");
const dataSourceDir = path.join(ROOT, "data");
const dataTargetDir = path.join(ROOT, "api", "data");
const filenames = [
  "schema.gql",
  "_graphql.json",
  "_lookup.json",
  "_schema.json",
  "types.ts",
  "queries.gql",
  "frags.gql",
  "static-media.json",
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function resetDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  ensureDir(dirPath);
}

function copyIfExists(filename) {
  const source = path.join(sourceDir, filename);
  const target = path.join(targetDir, filename);

  if (!fs.existsSync(source)) {
    return false;
  }

  fs.copyFileSync(source, target);
  return true;
}

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) return false;
  ensureDir(target);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      ensureDir(path.dirname(targetPath));
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
  return true;
}

function writeDatabaseClient() {
  const output = path.join(targetDir, "databaseClient.js");
  const content = `import { resolve } from "@tinacms/datalayer";
import database from "../database.js";

async function databaseRequest({ query, variables, user }) {
  const result = await resolve({
    config: { useRelativeMedia: true },
    database,
    query,
    variables,
    verbose: true,
    ctxUser: user,
  });

  return result;
}

async function authenticate({ username, password }) {
  return databaseRequest({
    query: \`query auth($username:String!, $password:String!) {
      authenticate(sub:$username, password:$password) {
        id: username
        username
        name
        email
        _password: password { passwordChangeRequired }
      }
    }\`,
    variables: { username, password },
  });
}

async function authorize(user) {
  return databaseRequest({
    query: \`query authz {
      authorize {
        id: username
        username
        name
        email
        _password: password { passwordChangeRequired }
      }
    }\`,
    variables: {},
    user,
  });
}

const databaseClient = {
  request: async ({ query, variables, user }) => {
    const data = await databaseRequest({ query, variables, user });
    return { data: data.data, query, variables, errors: data.errors || null };
  },
  authenticate,
  authorize,
};

export default databaseClient;
`;
  fs.writeFileSync(output, content);
  return "databaseClient.js";
}

function main() {
  resetDir(targetDir);
  const copied = filenames.filter(copyIfExists);
  copied.push(writeDatabaseClient());
  resetDir(contentTargetDir);
  if (copyDirectory(contentSourceDir, contentTargetDir)) {
    copied.push("content/**");
  }
  resetDir(dataTargetDir);
  if (copyDirectory(dataSourceDir, dataTargetDir)) {
    copied.push("data/**");
  }
  console.log(`Prepared Tina API assets: ${copied.join(", ")}`);
}

main();
