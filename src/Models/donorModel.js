import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  nic: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  created_at: { type: Date, default: Date.now },
  city: { type: String, default: null },
  district: { type: String, default: null },
  seed_batch_id: { type: String, default: null }
});

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;