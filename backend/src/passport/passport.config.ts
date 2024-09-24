import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.model"; // Assuming you have a User model with IUser interface
import { GraphQLLocalStrategy } from "graphql-passport";

import { Document } from "mongoose";

// The User type from Mongoose should match the document type
interface PassportUser extends Document {
  id: string;
  username: string;
  password: string;
}

export const configurePassport = async (): Promise<void> => {
  // Serializing user to store only the user ID in the session
  passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void): void => {
    console.log("Serializing User");
    done(null, (user as PassportUser).id);
  });

  // Deserializing the user by ID to retrieve user information
  passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | false) => void): Promise<void> => {
    console.log("Deserializing User");

    try {
      const user = await User.findById(id);
      done(null, user || false); // Return user or false if user is not found
    } catch (error) {
      done(error);
    }
  });

  // Corrected: Explicitly cast `username` and `password` as strings
  passport.use(
    new GraphQLLocalStrategy(
      async (username: unknown, password: unknown, done: (error: any, user?: Express.User | false) => void): Promise<void> => {
        try {
          const usernameStr = String(username); // Casting username to string
          const passwordStr = String(password); // Casting password to string

          const user = await User.findOne({ username: usernameStr });

          if (!user) {
            return done(new Error("Invalid username or password"), false);
          }

          const validPassword = await bcrypt.compare(passwordStr, user.password); // Ensure bcrypt returns a Promise

          if (!validPassword) {
            return done(new Error("Invalid username or password"), false);
          }

          return done(null, user); // Successful login
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
