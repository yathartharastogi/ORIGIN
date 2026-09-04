import jwt from "jsonwebtoken";

import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required.",
        },
        meta: {
          requestId: req.id,
        },
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User
      .findById(decoded.userId)
      .select("-passwordHash");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or inactive user.",
        },
        meta: {
          requestId: req.id,
        },
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired authentication token.",
      },
      meta: {
        requestId: req.id,
      },
    });
  }
};

export {
  protect,
};