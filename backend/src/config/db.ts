import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect('mongodb+srv://jakebravoke_db_user:gLEb5HF5Iq0R1og5@cluster0.ug7vlno.mongodb.net/FieldScale?retryWrites=true&w=majority&appName=Cluster0');
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