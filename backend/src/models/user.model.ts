import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minlength: [4, "Username must be at least 4 characters long"],
    maxlength: [20, "Username cannot exceed 20 characters"],
    match: [/^[a-zA-Z0-9]+$/, "Username can only contain alphanumeric characters"]
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    maxlength: [100, "Password cannot exceed 100 characters"],
  },
  profilePicture: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      message: "Gender must be either 'male' or 'female'"
    },
    required: [true, "Gender is required"]
  }
}, { timestamps: true });

export interface UserDocument extends mongoose.Document {
  username: string;
  name: string;
  password: string;
  profilePicture: string;
  gender: "male" | "female";
}

const User = mongoose.model("User", userSchema);

export default User
