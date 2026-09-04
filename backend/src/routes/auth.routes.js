import express from "express";

import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validation.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";


const router = express.Router();


router.post(
  "/register",
  validate(registerSchema),
  register
);


router.post(
  "/login",
  validate(loginSchema),
  login
);


router.post(
  "/logout",
  protect,
  logout
);


router.get(
  "/me",
  protect,
  getMe
);


export default router;