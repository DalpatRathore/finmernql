import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [3, "Description must be at least 3 characters long"],
    maxlength: [255, "Description cannot exceed 255 characters"]
  },
  paymentType: {
    type: String,
    required: [true, "Payment type is required"],
    enum: {
      values: ["cash", "card"],
      message: "Payment type must be either 'cash' or 'card'"
    }
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["saving", "expense", "investment"],
      message: "Category must be one of 'saving', 'expense', or 'investment'"
    }
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
    validate: {
      validator: Number.isFinite,
      message: "Amount must be a valid number"
    }
  },
  location: {
    type: String,
    default: "Unknown",
    maxlength: [100, "Location cannot exceed 100 characters"]
  },
  date: {
    type: Date,
    required: [true, "Transaction date is required"],
    validate: {
      validator: (v: Date) => v <= new Date(),
      message: "Date cannot be in the future"
    }
  }
}, { timestamps: true });

const Transaction= mongoose.model("Transaction", transactionSchema);

export default Transaction
