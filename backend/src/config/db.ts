import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      process.exit(1);
    }
    const connection = await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected successfully");
    console.log(`Database: ${connection.connection.name}`);
    console.log(`Host: ${connection.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
    } else {
      console.error("❌ MongoDB connection failed:", error);
    }

    process.exit(1);
  }
};