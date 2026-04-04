import express from "express";
import { login, getUsers } from "../Controllers/userController.js";
import { protect, authorizeRoles } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

// Only admin can view users
router.get("/all", protect, authorizeRoles("admin"), getUsers);

export default router;