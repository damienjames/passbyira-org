import { resolve } from "@tinacms/datalayer";
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
    query: `query auth($username:String!, $password:String!) {
      authenticate(sub:$username, password:$password) {
        id: username
        username
        name
        email
        _password: password { passwordChangeRequired }
      }
    }`,
    variables: { username, password },
  });
}

async function authorize(user) {
  return databaseRequest({
    query: `query authz {
      authorize {
        id: username
        username
        name
        email
        _password: password { passwordChangeRequired }
      }
    }`,
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
