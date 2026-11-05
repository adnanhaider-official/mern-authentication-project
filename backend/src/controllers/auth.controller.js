import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import googleClient from "../config/google.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Remove password from response
  const createdUser = await User.findById(user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password do not match");
  }

  // Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // Remove password from response
  const loggedInUser = await User.findById(user._id);

  // Send response
  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, loggedInUser, "Login successful"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, null, "Logout successful"));
});

export const getProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { name, bio } = req.body;

  // Update name and bio
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;

  // Upload new avatar
  if (req.file) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage) {
      throw new ApiError(500, "Avatar upload failed");
    }

    // Delete old avatar
    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    user.avatar = uploadedImage.secure_url;
    user.avatarPublicId = uploadedImage.public_id;
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }

  // 1. Verify Google ID Token
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // 2. Get Google user information
  const payload = ticket.getPayload();

  const { sub: googleId, name, email, picture, email_verified } = payload;

  if (!email || !email_verified) {
    throw new ApiError(401, "Google email is not verified");
  }

  // 3. Find existing user
  let user = await User.findOne({
    $or: [{ googleId }, { email: email.toLowerCase() }],
  });

  // 4. Create or link account
  if (user) {
    if (user.googleId && user.googleId !== googleId) {
      throw new ApiError(409, "Google account mismatch");
    }

    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
    }

    if (!user.avatar && picture) {
      user.avatar = picture;
    }

    await user.save();
  } else {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      googleId,
      authProvider: "google",
      avatar: picture || "",
    });
  }

  // 5. Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // 6. Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 7. Get user without password
  const loggedInUser = await User.findById(user._id);

  // 8. Send response
  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, loggedInUser, "Google login successful"));
});
