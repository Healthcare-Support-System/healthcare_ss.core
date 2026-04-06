import express from "express";
import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";
import {
  getDonationRequestByReferenceCode,
  createDonation,
  getAllDonations,
  deleteDonation,
  updateDonationStatus
} from "../Controllers/donationController.js";

const router = express.Router();

router.get(
  "/reference/:code",
  protect,
  authorizeRoles("admin", "social_worker"),
  getDonationRequestByReferenceCode
);

router.post(
  "/",
  protect,
  authorizeRoles("admin", "social_worker"),
  createDonation
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "social_worker"),
  getAllDonations
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "social_worker"),
  deleteDonation
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "social_worker"),
  updateDonationStatus
);

export default router;