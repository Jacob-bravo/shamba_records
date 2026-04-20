import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: "ADMIN" | "AGENT";
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true,},
    role: { type: String, enum: ["ADMIN", "AGENT"], default: "AGENT" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    avatar: { type: String },
  },
  { timestamps: true }
);

const User = (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;