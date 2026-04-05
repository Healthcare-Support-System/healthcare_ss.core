import express from "express";
import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";
import {
  createDonationRequest,
  getMyRequests,
  getRequestById,
  updateDonationRequest,
  deleteDonationRequest,
  acceptDonationRequest,
  getAllDonationRequests,
  rejectDonationRequest
} from "../Controllers/donationRequestController.js";


const router = express.Router();

router.post("/", createDonationRequest);

router.get("/donor/:donorId", getMyRequests);

router.get("/:id", getRequestById);

router.put("/:id", updateDonationRequest);

router.delete("/:id", deleteDonationRequest);

router.put(
  "/:id/accept",
  protect,
  authorizeRoles("admin"),
  acceptDonationRequest
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectDonationRequest
);

router.get("/", getAllDonationRequests);

export default router;