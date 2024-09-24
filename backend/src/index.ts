import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mergedTypeDefs from "./typeDefs";
import mergedResolvers from "./resolvers";

// Context interface for Apollo Server
interface MyContext {
  token?: string;
}

// Initialize Express App
const app = express();
const httpServer = http.createServer(app);

// Create Apollo Server instance
const server = new ApolloServer<MyContext>({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start Apollo Server
const startServer = async () => {
  await server.start();

  // Apply middleware after Apollo server starts
  app.use(
    '/',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // Start the HTTP server
  httpServer.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/`);
  });
};

// Start the server
startServer();
