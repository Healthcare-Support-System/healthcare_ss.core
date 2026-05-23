// import fs from "fs";
// import path from "path";
// import mongoose from "mongoose";
// import { parse } from "csv-parse/sync";
// import bcrypt from "bcryptjs";
// import dotenv from "dotenv";

// import User from "../Models/userModel.js";
// import Donor from "../Models/donorModel.js";
// import Patient from "../Models/patientModel.js";
// import Staff from "../Models/staffModel.js";
// import SupportRequest from "../Models/supportRequestModel.js";
// import DonationRequest from "../Models/donationRequestModel.js";
// import Donation from "../Models/donationModel.js";

// // dotenv.config();

// const args = process.argv.slice(2);
// const mode = args[0]; // seed | rollback
// const csvPath = args[1];
// const batchId = args[2] || `seed_${Date.now()}`;

// function value(row, key, fallback = null) {
//   const v = row[key];
//   if (v === undefined || v === null || String(v).trim() === "") return fallback;
//   return String(v).trim();
// }

// function safeNumber(v, fallback = 0) {
//   const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
//   return Number.isFinite(n) ? n : fallback;
// }

// function safeDate(v) {
//   const d = new Date(v);
//   return Number.isNaN(d.getTime()) ? new Date() : d;
// }

// function statusToDonationStatus(status) {
//   const s = String(status || "").toLowerCase();

//   if (s.includes("allocated")) return "allocated";
//   if (s.includes("used")) return "used";
//   if (s.includes("completed")) return "completed";

//   return "received";
// }

// function splitName(fullName) {
//   const parts = String(fullName || "Seed Donor").trim().split(/\s+/);
//   return {
//     first_name: parts[0] || "Seed",
//     last_name: parts.slice(1).join(" ") || "Donor"
//   };
// }

// async function rollbackSeed(batchId) {
//   console.log(`Rolling back seed batch: ${batchId}`);

//   await Donation.deleteMany({ seed_batch_id: batchId });
//   await DonationRequest.deleteMany({ seed_batch_id: batchId });
//   await SupportRequest.deleteMany({ seed_batch_id: batchId });
//   await Patient.deleteMany({ seed_batch_id: batchId });
//   await Donor.deleteMany({ seed_batch_id: batchId });
//   await Staff.deleteMany({ seed_batch_id: batchId });
//   await User.deleteMany({ seed_batch_id: batchId });

//   console.log("Rollback completed.");
// }

// async function seedData(csvPath, batchId) {
//   if (!csvPath) throw new Error("CSV path is required.");

//   const file = fs.readFileSync(path.resolve(csvPath), "utf8");

//   const records = parse(file, {
//     columns: true,
//     skip_empty_lines: true,
//     trim: true,
//     bom: true
//   });

//   console.log(`Rows found: ${records.length}`);
//   console.log(`Seed batch: ${batchId}`);

//   const passwordHash = await bcrypt.hash("Password@123", 10);

//   const adminUser = await User.create({
//     email: `seed.admin.${batchId}@healthcare.local`,
//     password_hash: passwordHash,
//     role: "admin",
//     seed_batch_id: batchId
//   });

//   const staff = await Staff.create({
//     user_id: adminUser._id,
//     full_name: "Seed Admin Staff",
//     staff_type: "admin",
//     designation: "Seed Data Admin",
//     phone: "0700000000",
//     seed_batch_id: batchId
//   });

//   const donorMap = new Map();
//   const patientMap = new Map();

//   for (const row of records) {
//     const donationId = value(row, "Donation ID");
//     const donorCsvId = value(row, "Donor ID");
//     const donorName = value(row, "Donor Name", "Seed Donor");
//     const donorEmail = value(
//       row,
//       "Donor Email",
//       `seed.donor.${donorCsvId || donationId}.${batchId}@healthcare.local`
//     );
//     const donorPhone = value(row, "Donor Phone Number", null);
//     const donorCity = value(row, "Donor City", null);
//     const donorDistrict = value(row, "Donor District", null);

//     const itemName = value(row, "Donation Item Name", "Unknown Item");
//     const donationType = value(row, "Donation Type", "Other");
//     const quantity = safeNumber(value(row, "Donation Quantity"), 1);
//     const unitEstimatedPrice = safeNumber(value(row, "Unit Estimated Price (LKR)"), 0);
//     const estimatedValue = safeNumber(value(row, "Estimated Value (LKR)"), quantity * unitEstimatedPrice);

//     const patientCsvId = value(row, "Patient ID");
//     const patientAge = safeNumber(value(row, "Patient Age"), null);
//     const patientGender = value(row, "Patient Gender", null);
//     const cancerType = value(row, "Patient Cancer Type", null);

//     const donationDate = safeDate(value(row, "Donation Date"));
//     const receivedDate = safeDate(value(row, "Received Date"));
//     const status = value(row, "Status", "Received");

//     let donor = donorMap.get(donorCsvId || donorEmail);

//     if (!donor) {
//       const donorUser = await User.create({
//         email: donorEmail,
//         password_hash: passwordHash,
//         role: "donor",
//         seed_batch_id: batchId
//       });

//       const name = splitName(donorName);

//       donor = await Donor.create({
//         user_id: donorUser._id,
//         first_name: name.first_name,
//         last_name: name.last_name,
//         nic: `SEED-${batchId}-${donorCsvId || Math.random().toString(36).slice(2, 10)}`,
//         phone: donorPhone,
//         address: donorCity,
//         city: donorCity,
//         district: donorDistrict,
//         seed_batch_id: batchId,
//         created_at: donationDate
//       });

//       donorMap.set(donorCsvId || donorEmail, donor);
//     }

//     let patient = patientMap.get(patientCsvId);

//     if (!patient) {
//       patient = await Patient.create({
//         registered_by: staff._id,
//         full_name: `Seed Patient ${patientCsvId}`,
//         dob: patientAge ? new Date(new Date().getFullYear() - patientAge, 0, 1) : null,
//         gender: patientGender,
//         address: donorDistrict,
//         contact_no: null,
//         guardian_name: null,
//         guardian_contact: null,
//         medical_condition: cancerType,
//         cancer_type: cancerType,
//         city: donorCity,
//         district: donorDistrict,
//         verification_status: "verified",
//         verification_documents: [],
//         seed_batch_id: batchId,
//         created_at: donationDate
//       });

//       patientMap.set(patientCsvId, patient);
//     }

//     const supportRequest = await SupportRequest.create({
//       patient_id: patient._id,
//       created_by: staff._id,
//       request_type: donationType,
//       description: `Seed support request for ${cancerType || "cancer patient"}`,
//       items: [
//         {
//           item_name: itemName,
//           quantity,
//           unit: "unit",
//           estimated_value: estimatedValue
//         }
//       ],
//       urgency_level: "medium",
//       status: "fulfilled",
//       needed_date: donationDate,
//       created_at: donationDate,
//       seed_batch_id: batchId
//     });

//     const donationRequest = await DonationRequest.create({
//       donor_id: donor._id,
//       request_id: supportRequest._id,
//       phone: donorPhone || "0700000000",
//       message: "Seed donation request",
//       status: "accepted",
//       reference_code: `REQ-${donationId || batchId}`,
//       accepted_by: staff._id,
//       accepted_at: donationDate,
//       created_at: donationDate,
//       seed_batch_id: batchId
//     });

//     await Donation.create({
//       donation_request_id: donationRequest._id,
//       request_id: supportRequest._id,
//       patient_id: patient._id,
//       donor_id: donor._id,
//       reference_code: donationId || `DON-${batchId}`,
//       received_by: staff._id,
//       received_date: receivedDate,
//       donation_type: donationType,
//       received_items: [
//         {
//           item_name: itemName,
//           quantity,
//           unit: "unit",
//           received: true
//         }
//       ],
//       donation_status: statusToDonationStatus(status),
//       remarks: `Seed donation. Unit price LKR ${unitEstimatedPrice}. Estimated value LKR ${estimatedValue}.`,
//       created_at: donationDate,
//       seed_batch_id: batchId
//     });
//   }

//   console.log("Seed completed successfully.");
//   console.log(`Donors created: ${donorMap.size}`);
//   console.log(`Patients created: ${patientMap.size}`);
//   console.log(`Donations created: ${records.length}`);
// }

// async function main() {
//   await mongoose.connect("mongodb+srv://emayafernando24_db_user:nAxfEnWNMcvEo9hQ@cluster0.glkfvcx.mongodb.net/healthcare_ss");
// //   await mongoose.connect(process.env.MONGO_URI);

//   try {
//     if (mode === "seed") {
//       await seedData(csvPath, batchId);
//     } else if (mode === "rollback") {
//       await rollbackSeed(csvPath);
//     } else {
//       console.log("Usage:");
//       console.log("Seed:");
//       console.log("node src/Seed/seedCancerDonations.js seed ./data/cancer_hospital_donation_dataset_all_in_one_1000.csv batch_001");
//       console.log("");
//       console.log("Rollback:");
//       console.log("node src/Seed/seedCancerDonations.js rollback batch_001");
//     }
//   } catch (error) {
//     console.error("Seed script failed:", error);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// main();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { parse } from "csv-parse/sync";
import bcrypt from "bcryptjs";

import User from "../Models/userModel.js";
import Donor from "../Models/donorModel.js";
import Patient from "../Models/patientModel.js";
import Staff from "../Models/staffModel.js";
import SupportRequest from "../Models/supportRequestModel.js";
import DonationRequest from "../Models/donationRequestModel.js";
import Donation from "../Models/donationModel.js";

const args = process.argv.slice(2);
const mode = args[0]; // seed | rollback
const csvPath = args[1];
const batchId = args[2] || `seed_${Date.now()}`;

const MONGO_URI = "mongodb+srv://emayafernando24_db_user:nAxfEnWNMcvEo9hQ@cluster0.glkfvcx.mongodb.net/healthcare_ss";

function get(row, key, fallback = null) {
  const value = row[key];
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }
  return String(value).trim();
}

function toObjectId(value) {
  if (!value) return new mongoose.Types.ObjectId();
  return new mongoose.Types.ObjectId(value);
}

function toDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function parseJson(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function createIfMissing(Model, _id, data) {
  const existing = await Model.findById(_id);
  if (existing) return existing;

  return Model.create({
    _id,
    ...data,
    seed_batch_id: batchId
  });
}

async function rollbackSeed(batchId) {
  console.log(`Rolling back seed batch: ${batchId}`);

  await Donation.deleteMany({ seed_batch_id: batchId });
  await DonationRequest.deleteMany({ seed_batch_id: batchId });
  await SupportRequest.deleteMany({ seed_batch_id: batchId });
  await Patient.deleteMany({ seed_batch_id: batchId });
  await Donor.deleteMany({ seed_batch_id: batchId });
  await Staff.deleteMany({ seed_batch_id: batchId });
  await User.deleteMany({ seed_batch_id: batchId });

  console.log("Rollback completed.");
}

async function seedData(csvPath, batchId) {
  if (!csvPath) throw new Error("CSV path is required.");

  const file = fs.readFileSync(path.resolve(csvPath), "utf8");

  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  });

  console.log(`Rows found: ${records.length}`);
  console.log(`Seed batch: ${batchId}`);

  const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

  for (const row of records) {
    const donorUserId = toObjectId(get(row, "donor_user._id"));
    const donorId = toObjectId(get(row, "donor._id"));

    const staffUserId = toObjectId(get(row, "staff_user._id"));
    const staffId = toObjectId(get(row, "staff._id"));

    const patientId = toObjectId(get(row, "patient._id"));
    const supportRequestId = toObjectId(get(row, "support_request._id"));
    const donationRequestId = toObjectId(get(row, "donation_request._id"));
    const donationId = toObjectId(get(row, "donation._id"));

    await createIfMissing(User, donorUserId, {
      email: get(row, "donor_user.email"),
      password_hash: defaultPasswordHash,
      role: get(row, "donor_user.role", "donor"),
      created_at: toDate(get(row, "donor_user.created_at"))
    });

    await createIfMissing(Donor, donorId, {
      user_id: donorUserId,
      first_name: get(row, "donor.first_name"),
      last_name: get(row, "donor.last_name"),
      nic: get(row, "donor.nic"),
      phone: get(row, "donor.phone"),
      address: get(row, "donor.address"),
      district: get(row, "donor.district"),
      created_at: toDate(get(row, "donor.created_at"))
    });

    await createIfMissing(User, staffUserId, {
      email: get(row, "staff_user.email"),
      password_hash: defaultPasswordHash,
      role: get(row, "staff_user.role", "social_worker"),
      created_at: toDate(get(row, "staff_user.created_at"))
    });

    await createIfMissing(Staff, staffId, {
      user_id: staffUserId,
      full_name: get(row, "staff.full_name"),
      staff_type: get(row, "staff.staff_type", "social_worker"),
      designation: get(row, "staff.designation"),
      phone: get(row, "staff.phone"),
      created_at: toDate(get(row, "staff.created_at"))
    });

    await createIfMissing(Patient, patientId, {
      registered_by: staffId,
      full_name: get(row, "patient.full_name"),
      dob: get(row, "patient.dob") ? toDate(get(row, "patient.dob")) : null,
      gender: get(row, "patient.gender"),
      address: get(row, "patient.address"),
      contact_no: get(row, "patient.contact_no"),
      guardian_name: get(row, "patient.guardian_name"),
      guardian_contact: get(row, "patient.guardian_contact"),
      medical_condition: get(row, "patient.medical_condition"),
      cancer_type: get(row, "patient.medical_condition"),
      verification_status: get(row, "patient.verification_status", "pending"),
      verification_documents: parseJson(
        get(row, "patient.verification_documents"),
        []
      ),
      created_at: toDate(get(row, "patient.created_at"))
    });

    await createIfMissing(SupportRequest, supportRequestId, {
      patient_id: patientId,
      created_by: staffId,
      request_type: get(row, "support_request.request_type"),
      description: get(row, "support_request.description"),
      items: parseJson(get(row, "support_request.items"), []),
      urgency_level: get(row, "support_request.urgency_level"),
      status: get(row, "support_request.status", "open"),
      needed_date: toDate(get(row, "support_request.needed_date")),
      created_at: toDate(get(row, "support_request.created_at"))
    });

    await createIfMissing(DonationRequest, donationRequestId, {
      donor_id: donorId,
      request_id: supportRequestId,
      phone: get(row, "donation_request.phone"),
      message: get(row, "donation_request.message"),
      status: get(row, "donation_request.status", "pending"),
      reference_code: get(row, "donation_request.reference_code"),
      accepted_by: staffId,
      accepted_at: toDate(get(row, "donation_request.accepted_at")),
      created_at: toDate(get(row, "donation_request.created_at"))
    });

    await createIfMissing(Donation, donationId, {
      donation_request_id: donationRequestId,
      request_id: supportRequestId,
      patient_id: patientId,
      donor_id: donorId,
      reference_code: get(row, "donation.reference_code"),
      received_by: staffId,
      received_date: toDate(get(row, "donation.received_date")),
      donation_type: get(row, "donation.donation_type"),
      received_items: parseJson(get(row, "donation.received_items"), []),
      donation_status: get(row, "donation.donation_status", "received"),
      remarks: get(row, "donation.remarks"),
      created_at: toDate(get(row, "donation.created_at"))
    });
  }

  console.log("Seed completed successfully.");
  console.log(`Rows processed: ${records.length}`);
}

async function main() {
  await mongoose.connect(MONGO_URI);

  try {
    if (mode === "seed") {
      await seedData(csvPath, batchId);
    } else if (mode === "rollback") {
      await rollbackSeed(csvPath);
    } else {
      console.log("Usage:");
      console.log(
        "node src/Config/seedCancerDonations.js seed ./src/Uploads/all_in_one_cancer_donation_dataset_1000_updated_dates.csv batch_001"
      );
      console.log(
        "node src/Config/seedCancerDonations.js rollback batch_001"
      );
    }
  } catch (error) {
    console.error("Seed script failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

main();