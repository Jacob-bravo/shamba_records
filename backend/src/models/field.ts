import mongoose, { Schema, Document, Model } from "mongoose";

export interface IField extends Document {
  name: string;
  cropType: string;
  plantingDate: Date;
  currentStage: "PLANTED" | "GROWING" | "READY" | "HARVESTED" | "AT RISK"|"IN PROGRESS";
  acres: number;
  location: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema = new Schema<IField>(
  {
    name: { type: String, required: true },
    cropType: { type: String, required: true },
    plantingDate: { type: Date, required: true },
    currentStage: {
      type: String,
      enum: ["PLANTED", "GROWING", "READY", "HARVESTED", "AT RISK","IN PROGRESS"],
      default: "PLANTED",
    },
    acres: { type: Number, required: true },
    location: { type: String, required: true },
    imageUrl: String,
  },
  { timestamps: true },
);

const Field =
  (mongoose.models.Field as Model<IField>) ||
  mongoose.model<IField>("Field", FieldSchema);

export default Field;
