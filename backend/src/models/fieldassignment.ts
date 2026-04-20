import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFieldAssignment extends Document {
  field: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; 
  assignedAt: Date;
}

const FieldAssignmentSchema = new Schema<IFieldAssignment>({
  field: { type: Schema.Types.ObjectId, ref: "Field", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedAt: { type: Date, default: Date.now },
});

const FieldAssignment =
  (mongoose.models.FieldAssignment as Model<IFieldAssignment>) ||
  mongoose.model<IFieldAssignment>("FieldAssignment", FieldAssignmentSchema);

export default FieldAssignment;