import "reflect-metadata";
import * as express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as session from "express-session";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { IncomingMessage } from "http";

const startServer = async () => {
  type Req = { req: IncomingMessage };
  // Setup apollo /graphql server route
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: Req) => ({ req })
  });
  const app = express();
  // Add sessions to the app
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: "TOP_SECRET"
    })
  );
  // Connect apollo and express
  server.applyMiddleware({ app });
  // connect typeorm to DB
  await createConnection();

  app.listen(3000, () => {
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
  });
};

startServer();
