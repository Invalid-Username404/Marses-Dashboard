import mongoose, { Schema } from "mongoose";

const StatisticSchema = new Schema(
  {
    title: String,
    value: String,
  },
  {
    collection: "statistics",
    strict: false,
    timestamps: false,
  }
);

export default mongoose.models.Statistic ||
  mongoose.model("Statistic", StatisticSchema);
