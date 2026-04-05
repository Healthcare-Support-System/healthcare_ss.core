import express from "express";
import SupportRequestController from "../Controllers/supportRequestController.js";

const router = express.Router();

router.get("/all", SupportRequestController.getAllSupportRequests);

export default router;