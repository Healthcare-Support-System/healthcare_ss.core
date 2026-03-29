import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("🚀 Connected to MongoDB");

        await import("../Models/userModel.js");
        await import("../Models/donorModel.js");
        await import("../Models/staffModel.js");
        await import("../Models/patientModel.js");
        await import("../Models/donationModel.js");
        await import("../Models/supportRequestModel.js");
        await import("../Models/donationRequestModel.js")
        await import("../Models/donationUsageModel.js")

        console.log("Database & Schemas Initialized");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); // Exit process on failure
    }
};

export default connectDB;