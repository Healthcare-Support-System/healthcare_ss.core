import express from "express";
import { registerDonor } from "../Controllers/donorController.js";

const router = express.Router();

router.post("/register", registerDonor);

export default router;