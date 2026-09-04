import { Request, Response, NextFunction } from "express";

import {
  registrationSchema,
} from "../validators/registration.validator";

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const result = registrationSchema.safeParse(
    req.body,
  );

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid registration data.",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  /*
   * Replace request body with validated data.
   */
  req.body = result.data;

  next();
};