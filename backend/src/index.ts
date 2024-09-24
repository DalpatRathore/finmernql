import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";

import passport from "passport";
import session from "express-session";
import connectMongo from 'connect-mongodb-session'

import { buildContext } from "graphql-passport";

import mergedTypeDefs from "./typeDefs";
import mergedResolvers from "./resolvers";
import { connectDB } from "./config/db";
import { configurePassport } from "./passport/passport.config";




// Load environment variables
dotenv.config();

configurePassport()

// Context interface for Apollo Server
interface MyContext {
  token?: string;
}

// Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set.");
}
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set.");
}

const PORT = process.env.PORT || 4000

// Initialize Express App
const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions"
})
store.on("error", (err)=> console.error(err))

// Express session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store, // Using the MongoDB session store
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session())

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
      cors<cors.CorsRequest>({
        origin:"http://localhost:3000",
        credentials:true
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req,res }) => buildContext({req,res}),
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
