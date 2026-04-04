import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/Config/db.js";
import seedDatabase from "./src/Config/seedDB.js";
import userRoutes from "./src/Routes/userRoutes.js";
import cors from "cors";

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

// Routes
app.use("/api/users", userRoutes);


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