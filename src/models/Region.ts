import mongoose, { Schema } from "mongoose";

const ValueSchema = new Schema(
  {
    date: String,
    value: Number,
  },
  { _id: false }
);

const RegionSchema = new Schema(
  {
    name: String,
    values: [ValueSchema],
  },
  {
    collection: "regions",
    strict: false,
    timestamps: false,
  }
);

export default mongoose.models.Region || mongoose.model("Region", RegionSchema);
