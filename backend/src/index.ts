import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";

import mergedTypeDefs from "./typeDefs";
import mergedResolvers from "./resolvers";
import { connectDB } from "./config/db";

// Load environment variables
dotenv.config();

// Context interface for Apollo Server
interface MyContext {
  token?: string;
}

// Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set.");
}


const PORT = process.env.PORT || 4000

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
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Apollo Server
    await server.start();

    // Apply middleware after Apollo server starts
    app.use(
      '/',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          // Optionally log the token or add any other context-related logic
          const token = req.headers.token as string | undefined;
          return { token };
        },
      })
    );

    // Start the HTTP server
    httpServer.listen(PORT, () => {
      console.log(`❄️  Server ready at port:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
