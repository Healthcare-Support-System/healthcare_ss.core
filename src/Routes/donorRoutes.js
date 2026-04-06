import express from "express";
import {
  deleteDonorProfile,
  getDonorProfile,
  updateDonorProfile
} from "../Controllers/donorProfileController.js";
import { registerDonor } from "../Controllers/donorController.js";
import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerDonor);
router.get("/profile", protect, authorizeRoles("donor"), getDonorProfile);
router.put("/profile", protect, authorizeRoles("donor"), updateDonorProfile);
router.delete("/profile", protect, authorizeRoles("donor"), deleteDonorProfile);

export default router;
