import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFieldUpdate extends Document {
  field: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  stage?:
    | "PLANTED"
    | "GROWING"
    | "READY"
    | "HARVESTED"
    | "AT RISK"
    | "IN PROGRESS";
  agentname?: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FieldUpdateSchema = new Schema<IFieldUpdate>(
  {
    field: { type: Schema.Types.ObjectId, ref: "Field", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stage: {
      type: String,
      enum: [
        "PLANTED",
        "GROWING",
        "READY",
        "HARVESTED",
        "AT RISK",
        "IN PROGRESS",
      ],
    },
    agentname: String,
    observations: String,
  },
  { timestamps: true },
);

const FieldUpdate =
  (mongoose.models.FieldUpdate as Model<IFieldUpdate>) ||
  mongoose.model<IFieldUpdate>("FieldUpdate", FieldUpdateSchema);

export default FieldUpdate;
