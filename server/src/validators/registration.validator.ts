import { z } from "zod";

/*
 * ============================================================
 * MAC ADDRESS
 * ============================================================
 */

const macAddressSchema = z
  .string()
  .trim()
  .regex(
    /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
    "Invalid MAC address format",
  );

/*
 * ============================================================
 * LAPTOP
 * ============================================================
 */
const laptopSchema = z
  .object({
    requested: z.boolean(),

    operatingSystem: z
      .enum(["Windows", "Linux", "macOS"])
      .optional(),

    macAddress: macAddressSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.requested) {
      return;
    }

    if (!data.operatingSystem) {
      ctx.addIssue({
        code: "custom",
        path: ["operatingSystem"],
        message: "Laptop operating system is required.",
      });
    }

    if (!data.macAddress) {
      ctx.addIssue({
        code: "custom",
        path: ["macAddress"],
        message: "Laptop MAC address is required.",
      });
    }
  });

/*
 * ============================================================
 * SMARTPHONE
 * ============================================================
 */

const smartphoneSchema = z
  .object({
    requested: z.boolean(),

    operatingSystem: z
      .enum(["Android", "iOS"])
      .optional(),

    macAddress: macAddressSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.requested) {
      return;
    }

    if (!data.operatingSystem) {
      ctx.addIssue({
        code: "custom",
        path: ["operatingSystem"],
        message: "Smartphone operating system is required.",
      });
    }

    if (!data.macAddress) {
      ctx.addIssue({
        code: "custom",
        path: ["macAddress"],
        message: "Smartphone MAC address is required.",
      });
    }
  });

/*
 * ============================================================
 * GUESTHOUSE
 * ============================================================
 */

const guesthouseSchema = z
  .object({
    staying: z.boolean(),

    name: z
      .enum(["IICT_PRAGYAN_HOSTEL", "IICT_GUEST_HOUSE", "NGRI", "CCMB"])
      .optional(),

    roomNumber: z
      .string()
      .trim()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.staying && !data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: "Guesthouse name is required.",
      });
    }

    if (data.staying && !data.roomNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["roomNumber"],
        message: "Guesthouse room number is required.",
      });
    }
  });

/*
 * ============================================================
 * ORGANIZATION
 * ============================================================
 */

const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization is required"),
});

/*
 * ============================================================
 * REGISTRATION
 * ============================================================
 */

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required"),

  designation: z
    .string()
    .trim()
    .min(1, "Designation is required"),

  employeeId: z
    .string()
    .trim()
    .min(1, "Employee ID is required"),

  institutionEmail: z
    .string()
    .trim()
    .email("Invalid institutional email address"),

  mobileNumber: z
  .string()
  .trim()
  .regex(
    /^[6-9]\d{9}$/,
    "Please enter a valid 10-digit mobile number.",
  ),

  organization: organizationSchema,

  divisionGroup: z
    .string()
    .trim()
    .min(1, "Division / Group is required"),

  devices: z.object({
    laptop: laptopSchema,

    smartphone: smartphoneSchema,
  }),

  guesthouse: guesthouseSchema,
  arrivalDateTime: z
  .string()
  .min(1, "Arrival date and time is required")
  .refine(
    (value) => {
      const selectedDateTime = new Date(value);
      const now = new Date();

      return selectedDateTime >= now;
    },
    {
      message: "Arrival date and time cannot be in the past",
    },
  ),

 date: z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Date must be in YYYY-MM-DD format",
  )
  .refine(
    (value) => {
      const selectedDate = new Date(`${value}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      return selectedDate >= today;
    },
    {
      message: "Registration date cannot be in the past",
    },
  ),

  place: z
    .string()
    .trim()
    .min(1, "Place is required"),

  declarationAccepted: z
    .boolean()
    .refine(
      (value) => value === true,
      {
        message:
          "Declaration must be accepted",
      },
    ),
});

/*
 * ============================================================
 * TYPE
 * ============================================================
 */

export type RegistrationInput = z.infer<
  typeof registrationSchema
>;