import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";


const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};


const register = async (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      data: null,
      error: {
        code: "EMAIL_ALREADY_EXISTS",
        message: "An account with this email already exists.",
      },
      meta: {
        requestId: req.id,
      },
    });
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "SUPPORT_AGENT",
  });

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};


const login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const user = await User
    .findOne({
      email: email.toLowerCase(),
    })
    .select("+passwordHash");

  if (!user) {
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      },
      meta: {
        requestId: req.id,
      },
    });
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      },
      meta: {
        requestId: req.id,
      },
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      data: null,
      error: {
        code: "ACCOUNT_INACTIVE",
        message: "This account is inactive.",
      },
      meta: {
        requestId: req.id,
      },
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};


const logout = async (req, res) => {
  res.clearCookie("token");

  return res.json({
    success: true,
    data: {
      message: "Logged out successfully.",
    },
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};


const getMe = async (req, res) => {
  return res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};


export {
  register,
  login,
  logout,
  getMe,
};