import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: {
    type: String,
    enum: ["donor", "social_worker", "admin"],
    required: true
  },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;