import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Admin } from "../models/admin.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const COOKIE_NAME = "admin_token";

// const getCookieOptions = () => ({
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite:
//     process.env.NODE_ENV === "production"
//       ? ("lax" as const)
//       : ("lax" as const),
//   maxAge: 24 * 60 * 60 * 1000,
// });

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});

export const loginAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });

      return;
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured.");

      res.status(500).json({
        success: false,
        message: "Authentication configuration error.",
      });

      return;
    }

    const token = jwt.sign(
      {
        sub: admin._id.toString(),
        email: admin.email,
      },
      secret,
      {
        expiresIn: "1d",
      },
    );

    res.cookie(
      COOKIE_NAME,
      token,
      getCookieOptions(),
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
};

export const getCurrentAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.admin?.sub) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const admin = await Admin.findById(
      req.admin.sub,
    ).select("_id name email");

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get current admin error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get admin.",
    });
  }
};

export const logoutAdmin = (
  _req: Request,
  res: Response,
): void => {
  res.clearCookie(
    COOKIE_NAME,
    getCookieOptions(),
  );

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};