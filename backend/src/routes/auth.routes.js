import express from "express";
import {
  getProfile,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/auth.controller.js";

import validate from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  validate(updateProfileSchema),
  updateProfile,
);
router.post("/google", googleLogin);

export default router;
