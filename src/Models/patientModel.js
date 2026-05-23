import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  registered_by: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  full_name: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  address: { type: String },
  contact_no: { type: String },
  guardian_name: { type: String },
  guardian_contact: { type: String },
  medical_condition: { type: String },
  verification_status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  verification_documents: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  district: { type: String, default: null },
  city: { type: String, default: null },
  cancer_type: { type: String, default: null },
  seed_batch_id: { type: String, default: null }
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;


