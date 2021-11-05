import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

require('dotenv').config();
const postgres = require('postgres');
const sql = postgres();

const typeDefs = gql`
  type Query {
    user(username: String): User
  }
  type Mutation {
    createUser(username: String!, passwordHash: String!): User
  }
  type User {
    username: String
    passwardHash: String
  }
`;

const getUser = async (id) => {
  const result = await sql`
  SELECT * FROM "user" WHERE id = ${id};`;
  return result[0];
};

const createUser = async (username, passwordHash) => {
  const result = await sql`
  INSERT INTO "user" (username, password_hash) VALUES (${username}, ${passwordHash}) RETURNING username, password_hash;`;
  return result[0];
};

/* const createProfile = async (
  firstName: string,
  lastName: string,
  location: string,
  timeStart: Date,
  timeEnd: Date,
) => {
  const result = await sql`
  INSERT INTO profile (first_name, last_name, location, time_start, time_end) VALUES (${firstName}, ${lastName}, ${location}, ${timeStart}, ${timeEnd}) RETURNING first_name, last_name, location, time_start, time_end;`;
  return result[0];
}; */

/* type CreateUserArgsType = {
  username: string;
  passwordHash: string;
}; */

const resolvers = {
  Query: {
    user: (parent, id) => {
      return getUser(id);
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      return createUser(args.username, args.passwordHash);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
});
