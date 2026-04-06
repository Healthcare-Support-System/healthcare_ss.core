import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/Config/db.js";
import seedDatabase from "./src/Config/seedDB.js";
import userRoutes from "./src/Routes/userRoutes.js";
import patientRoutes from "./src/Routes/patientRoutes.js";
import supportRequestRoutes from "./src/Routes/supportRequestRoutes.js";
import donorRoutes from "./src/Routes/donorRoutes.js";
import donationRequestRoutes from "./src/Routes/donationRequestRoutes.js";
import donationRoutes from "./src/Routes/donationsRoutes.js";
import cors from "cors";
import path from "path";


dotenv.config();

const startServer = async () => {
  await connectDB();
  await seedDatabase();
}

startServer();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Static folder for uploaded PDFs
app.use("/src/Uploads", express.static(path.resolve("src/Uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/support-requests", supportRequestRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/donation-requests", donationRequestRoutes);
app.use("/api/donations", donationRoutes);


// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
