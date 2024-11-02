import mongoose, { models, model, Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "/icons/default-avatar.svg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use optional chaining to prevent undefined errors
const User = models?.User || model("User", userSchema);

export default User;
