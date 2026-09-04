import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AdminPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedRequest
  extends Request {
  admin?: AdminPayload;
}

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
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

    const decoded = jwt.verify(
      token,
      secret,
    ) as AdminPayload;

    req.admin = {
      sub: decoded.sub,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication.",
    });
  }
};