import mongoose, { Document, Schema } from "mongoose";

/*
 * ============================================================
 * DEVICE
 * ============================================================
 */

const deviceSchema = new Schema(
  {
    requested: {
      type: Boolean,
      default: false,
    },

    operatingSystem: {
      type: String,
      enum: ["Windows", "Linux", "macOS", "Android", "iOS"],
    },

    macAddress: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  {
    _id: false,
  },
);

/*
 * ============================================================
 * GUESTHOUSE
 * ============================================================
 */

const guesthouseSchema = new Schema(
  {
    staying: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      enum: ["IICT", "NGRI", "CCMB"],
    },

    roomNumber: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

/*
 * ============================================================
 * ORGANIZATION
 * ============================================================
 */

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

/*
 * ============================================================
 * REGISTRATION DOCUMENT
 * ============================================================
 */

export interface IRegistration extends Document {
  fullName: string;
  designation: string;
  employeeId: string;
  institutionEmail: string;
  mobileNumber: string;

  organization: {
    name: string;
  };

  divisionGroup: string;

  devices: {
    laptop: {
      requested: boolean;
      operatingSystem?: "Windows" | "Linux" | "macOS";
      macAddress?: string;
    };

    smartphone: {
      requested: boolean;
      operatingSystem?: "Android" | "iOS";
      macAddress?: string;
    };
  };

  guesthouse: {
    staying: boolean;
    name?: "IICT" | "NGRI" | "CCMB";
    roomNumber?: string;
  };

  date: string;
  place: string;

  declarationAccepted: boolean;

  status: "pending" | "approved" | "rejected";

  createdAt: Date;
  updatedAt: Date;
}

/*
 * ============================================================
 * REGISTRATION SCHEMA
 * ============================================================
 */

const registrationSchema = new Schema<IRegistration>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      trim: true,
    },

    institutionEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    organization: {
      type: organizationSchema,
      required: true,
    },

    divisionGroup: {
      type: String,
      required: true,
      trim: true,
    },

    devices: {
      laptop: {
        type: deviceSchema,
        default: () => ({
          requested: false,
        }),
      },

      smartphone: {
        type: deviceSchema,
        default: () => ({
          requested: false,
        }),
      },
    },

    guesthouse: {
      type: guesthouseSchema,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    place: {
      type: String,
      required: true,
      trim: true,
    },

    declarationAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

/*
 * ============================================================
 * MODEL
 * ============================================================
 */

const Registration = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema,
);

export default Registration;