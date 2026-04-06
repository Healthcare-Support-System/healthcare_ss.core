import mongoose from "mongoose";

const donationRequestSchema = new mongoose.Schema({
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  request_id: { type: mongoose.Schema.Types.ObjectId, ref: "SupportRequest", required: true },
  phone: { type: String, required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  reference_code: { type: String },
  accepted_by: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  accepted_at: { type: Date },
  created_at: { type: Date, default: Date.now }
});

const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);
export default DonationRequest;
