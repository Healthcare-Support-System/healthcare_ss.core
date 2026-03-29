import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  full_name: { type: String, required: true },
  staff_type: {
    type: String,
    enum: ["social_worker", "admin"],
    required: true
  },
  designation: { type: String },
  phone: { type: String },
  created_at: { type: Date, default: Date.now }
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;