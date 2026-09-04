import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { connectDB } from "../config/db";
import { Admin } from "../models/admin.model";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    if (!email || !password || !name) {
      throw new Error(
        "ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME must be set in .env",
      );
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(
      password,
      12,
    );

    await Admin.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    console.log("=================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();