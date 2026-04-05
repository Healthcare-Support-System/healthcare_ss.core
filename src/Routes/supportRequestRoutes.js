import express from "express";
import SupportRequestController from "../Controllers/supportRequestController.js";
import {
    protect,
    optionalProtect,
    authorizeRoles,
} from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post(
    "/add",
    protect,
    authorizeRoles("admin", "social_worker"),
    SupportRequestController.createSupportRequest
);

router.get(
    "/all",
    optionalProtect,
    SupportRequestController.getAllSupportRequests
);

router.get(
    "/:id",
    optionalProtect,
    SupportRequestController.getSupportRequestById
);

router.put(
    "/update/:id",
    protect,
    authorizeRoles("admin", "social_worker"),
    SupportRequestController.updateSupportRequest
);

router.delete(
    "/delete/:id",
    protect,
    authorizeRoles("admin","social_worker"),
    SupportRequestController.deleteSupportRequest
);

export default router;