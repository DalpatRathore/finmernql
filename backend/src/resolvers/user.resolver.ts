import { users } from "../constants/dummy-data";
import User, { UserDocument } from "../models/user.model";
import bcrypt from "bcryptjs";

import { Request, Response } from 'express';

interface GraphQLContext {
  req: Request;
  res: Response;
  login: (user: UserDocument) => Promise<void>;
  logout: () => Promise<void>;
  authenticate: (
    strategy: string,
    options: { username: string; password: string }
  ) => Promise<{ user: UserDocument }>;
  getUser: () => Promise<UserDocument | null>;
};


interface SignUpInput {
  input: {
    username: string;
    name: string;
    password: string;
    gender: string;
  };
}

interface LoginInput {
  input: {
    username: string;
    password: string;
  };
}

const userResolver = {
  Mutation: {
    signUp: async (_: unknown, { input }: SignUpInput, context: GraphQLContext) => {
      try {
        const { username, name, password, gender } = input;

        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let profilePicture = "";
        if (gender === "male") {
          profilePicture = "https://avatar.iran.liara.run/public/boy?username=${username}";
        } else if (gender === "female") {
          profilePicture = "https://avatar.iran.liara.run/public/girl?username=${username}";
        }

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture,
        });
        await newUser.save();

        await context.login(newUser);

        return newUser;
      } catch (error: any) {
        console.log("Error in signup", error);
        throw new Error(error.message || "Internal server error");
      }
    },

    login: async (_: unknown, { input }: LoginInput, context: GraphQLContext) => {
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", { username, password });

        await context.login(user);
        return user;
      } catch (error: any) {
        console.log("Error in login", error);
        throw new Error(error.message || "Internal server error");
      }
    },

    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logout successfully" };
      } catch (error: any) {
        console.log("Error in logout", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },

  Query: {
    authUser: async(_:unknown, __:unknown, context:GraphQLContext)=>{
      try {
        const user = await context.getUser()
        return user;
        
      } catch (error:any) {
        console.log("Error in authUser", error);
        throw new Error(error.message || "Internal server error");
        
      }
    },
    user: async(_:unknown,{userId}: { userId: string }): Promise<UserDocument | null> =>{
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error:any) {
        console.log("Error in getting user", error);
        throw new Error(error.message || "Internal server error");
        
      }
    }
  },
  
};

export default userResolver;
