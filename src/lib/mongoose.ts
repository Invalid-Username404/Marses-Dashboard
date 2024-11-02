import mongoose from "mongoose";

export const runtime = "nodejs";

const MONGODB_URI = process.env.MONGODB_URI || "";

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);

    // Keep basic connection logging
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default dbConnect;
