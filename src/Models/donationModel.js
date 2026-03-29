import mongoose from "mongoose";

const receivedItemSchema = new mongoose.Schema({
  item_name: String,
  quantity: Number,
  unit: String,
  received: Boolean
}, { _id: false });

const donationSchema = new mongoose.Schema({
  donation_request_id: { type: mongoose.Schema.Types.ObjectId, ref: "DonationRequest" },
  request_id: { type: mongoose.Schema.Types.ObjectId, ref: "SupportRequest" },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
  reference_code: { type: String },
  received_by: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  received_date: { type: Date },
  donation_type: { type: String },
  received_items: [receivedItemSchema],
  donation_status: {
    type: String,
    enum: ["received", "stored", "allocated"]
  },
  remarks: { type: String },
  created_at: { type: Date, default: Date.now }
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;