import express from "express";
import {
  createDonationRequest,
  getMyRequests,
  getRequestById,
  updateDonationRequest,
  deleteDonationRequest
} from "../Controllers/donationRequestController.js";

const router = express.Router();

router.post("/", createDonationRequest);

router.get("/donor/:donorId", getMyRequests);

router.get("/:id", getRequestById);

router.put("/:id", updateDonationRequest);

router.delete("/:id", deleteDonationRequest);

export default router;