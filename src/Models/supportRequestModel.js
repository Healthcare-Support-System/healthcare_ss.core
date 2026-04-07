import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  item_name: String,
  quantity: Number,
  unit: String,
  estimated_value: Number
}, { _id: false });

const supportRequestSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  request_type: { type: String },
  description: { type: String },
  items: [itemSchema],
  urgency_level: { type: String },
  
  status: {
  type: String,
  enum: ["open", "pending", "fulfilled", "closed"],
  default: "open"
},
  needed_date: { type: Date },
  created_at: { type: Date, default: Date.now }
});

const SupportRequest = mongoose.model("SupportRequest", supportRequestSchema);
export default SupportRequest;