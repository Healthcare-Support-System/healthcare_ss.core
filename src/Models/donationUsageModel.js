import mongoose from "mongoose";

const donationUsageSchema = new mongoose.Schema({
  donation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
  request_id: { type: mongoose.Schema.Types.ObjectId, ref: "SupportRequest" },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  allocated_by: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  used_date: { type: Date },
  usage_status: {
    type: String,
    enum: ["allocated", "used", "completed"]
  },
  remarks: { type: String },
  created_at: { type: Date, default: Date.now }
});

const DonationUsage = mongoose.model("DonationUsage", donationUsageSchema);
export default DonationUsage;