import express from "express";
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";

import validate from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authMiddleware, getProfile);

export default router;
