import mongoose, { Schema } from "mongoose";

const ValueSchema = new Schema(
  {
    date: String,
    value: Number,
  },
  { _id: false }
);

const DataSchema = new Schema(
  {
    name: String,
    value: Number,
    values: [ValueSchema],
  },
  { _id: false }
);

const ChartSchema = new Schema(
  {
    chart_type: String,
    data: [DataSchema],
  },
  {
    collection: "charts",
    strict: false,
    timestamps: false,
  }
);

export default mongoose.models.Chart || mongoose.model("Chart", ChartSchema);
