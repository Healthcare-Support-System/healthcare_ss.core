import express from "express";
import {
  addPatient,
  getPatients,
  getPatient,
  editPatient,
  removePatient,
} from "../Controllers/patientController.js";
import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";
import { uploadPatientDocuments } from "../Middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add-patient",
  protect,
  authorizeRoles("admin"),
  uploadPatientDocuments.array("verification_documents", 10),
  addPatient
);

router.get(
  "/get-patients",
  protect,
  authorizeRoles("admin","social_worker"),
  getPatients
);

router.get(
  "/get-patient/:id",
  protect,
  authorizeRoles("admin","social_worker"),
  getPatient
);

router.put(
  "/update-patient/:id",
  protect,
  authorizeRoles("admin"),
  uploadPatientDocuments.array("verification_documents", 10),
  editPatient
);

router.delete(
  "/delete-patient/:id",
  protect,
  authorizeRoles("admin"),
  removePatient
);

export default router;