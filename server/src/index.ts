import "reflect-metadata";
import "dotenv/config";
import * as express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as session from "express-session";
import * as pgStore from "connect-pg-simple";

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

  // connect typeorm to DB
  const connection = await createConnection();

  const SessionStore = pgStore(session);

  const app = express();
  // Add sessions to the app
  app.use(
    session({
      store: new SessionStore({
        pgPromise: connection
      }),
      resave: false,
      saveUninitialized: false,
      secret: "TOP_SECRET"
    })
  );
  // Connect apollo and express
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "http://localhost:3000"
    }
  });

  app.listen(4000, () => {
    console.clear();
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer();
