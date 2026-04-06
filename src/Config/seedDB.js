// seedDB.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // <-- import bcrypt
import {
  User,
  Donor,
  Staff,
  Patient,
  SupportRequest,
  DonationRequest,
  Donation,
  DonationUsage
} from "../Models/index.js";

const seedDatabase = async () => {
  try {
    // --- Seed Admin User ---
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10); // <-- hash password
      adminUser = await User.create({
        email: "admin@healthcare.com",
        password_hash: hashedPassword,
        role: "admin"
      });
    }

    // --- Seed Social Worker User ---
    let socialWorkerUser = await User.findOne({ role: "social_worker" });
    if (!socialWorkerUser) {
      const hashedPassword = await bcrypt.hash("worker123", 10);
      socialWorkerUser = await User.create({
        email: "socialworker@healthcare.com",
        password_hash: hashedPassword,
        role: "social_worker"
      });
    }

    // --- Seed Donor User ---
    let donorUser = await User.findOne({ role: "donor" });
    if (!donorUser) {
      const hashedPassword = await bcrypt.hash("donor123", 10);
      donorUser = await User.create({
        email: "donor@healthcare.com",
        password_hash: hashedPassword,
        role: "donor"
      });
    }

    // --- Seed Donor Profile ---
    let donorProfile = await Donor.findOne();
    if (!donorProfile) {
      donorProfile = await Donor.create({
        user_id: donorUser._id,
        first_name: "John",
        last_name: "Doe",
        nic: "123456789V",
        phone: "0712345678",
        address: "Colombo, Sri Lanka"
      });
    }

    // --- Seed Staff Profiles ---
    let adminStaff = await Staff.findOne({ staff_type: "admin" });
    if (!adminStaff) {
      await Staff.create({
        user_id: adminUser._id,
        full_name: "Admin Staff",
        staff_type: "admin",
        designation: "System Administrator",
        phone: "0771234567"
      });
    }

    let socialWorkerStaff = await Staff.findOne({ staff_type: "social_worker" });
    if (!socialWorkerStaff) {
      await Staff.create({
        user_id: socialWorkerUser._id,
        full_name: "Social Worker",
        staff_type: "social_worker",
        designation: "Case Worker",
        phone: "0779876543"
      });
    }

    // --- Seed a Patient ---
    let patient = await Patient.findOne();
    if (!patient) {
      const socialWorker = await Staff.findOne({ staff_type: "social_worker" });
      patient = await Patient.create({
        registered_by: socialWorker._id,
        full_name: "Jane Patient",
        dob: new Date("2010-01-01"),
        gender: "Female",
        address: "Kandy, Sri Lanka",
        contact_no: "0712345678",
        guardian_name: "John Patient",
        guardian_contact: "0711111111",
        medical_condition: "Mild Asthma",
        verification_status: "verified",
        verification_documents: []
      });
    }

     // --- Seed a Support Request ---
    let supportRequest = await SupportRequest.findOne();
    if (!supportRequest) {
      const socialWorker = await Staff.findOne({ staff_type: "social_worker" });
      supportRequest = await SupportRequest.create({
        patient_id: patient._id,
        created_by: socialWorker._id,
        request_type: "Medical Support",
        description: "Need medicines for asthma",
        items: [
          { item_name: "Inhaler", quantity: 1, unit: "pcs", estimated_value: 50 },
          { item_name: "Nebulizer", quantity: 1, unit: "pcs", estimated_value: 500 }
        ],
        urgency_level: "High",
        status: "pending",
        needed_date: new Date()
      });
      //console.log("Support Request Created");
    }

    // --- Seed a Donation Request ---
    let donationRequest = await DonationRequest.findOne();
    if (!donationRequest) {
      donationRequest = await DonationRequest.create({
        donor_id: donorProfile._id,
        request_id: supportRequest._id,
        phone: donorProfile.phone,
        message: "Happy to help!",
        status: "pending"
      });
      //console.log("Donation Request Created");
    }

    // --- Seed a Donation ---
    let donation = await Donation.findOne();
    if (!donation) {
      const socialWorker = await Staff.findOne({ staff_type: "social_worker" });
      donation = await Donation.create({
        donation_request_id: donationRequest._id,
        request_id: supportRequest._id,
        patient_id: patient._id,
        donor_id: donorProfile._id,
        reference_code: "REF001",
        received_by: socialWorker._id,
        received_date: new Date(),
        donation_type: "Medical Items",
        received_items: [
          { item_name: "Inhaler", quantity: 1, unit: "pcs", received: true },
          { item_name: "Nebulizer", quantity: 1, unit: "pcs", received: true }
        ],
        donation_status: "received",
        remarks: "Delivered successfully"
      });
      //console.log("Donation Created");
    }

    // --- Seed Donation Usage ---
    //let donationUsage = await DonationUsage.findOne();
    //if (!donationUsage) {
      //const socialWorker = await Staff.findOne({ staff_type: "social_worker" });
      //await DonationUsage.create({
        //donation_id: donation._id,
        //request_id: supportRequest._id,
        //patient_id: patient._id,
        //allocated_by: socialWorker._id,
        //used_date: new Date(),
        //usage_status: "allocated",
        //remarks: "Allocated to patient"
      //});
      //console.log("Donation Usage Created");
    //}

    console.log("Database Seeding Completed Successfully!");
  } catch (error) {
    console.error("Database Seeding Error:", error);
  }
};

export default seedDatabase;
