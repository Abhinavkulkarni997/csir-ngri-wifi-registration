import {Request,Response} from "express";
import ExcelJS from "exceljs";
import Registration from "../models/registration.model";

/*
 * ============================================================
 * DUPLICATE REGISTRATION
 * ============================================================
 */
export const checkDuplicateRegistration = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { employeeId, mobileNumber } = req.query;

    if (!employeeId || !mobileNumber) {
      res.status(400).json({
        success: false,
        message: "Employee ID and Mobile Number are required.",
      });
      return;
    }

    const existingRegistration = await Registration.findOne({
      employeeId: String(employeeId).trim(),
      mobileNumber: String(mobileNumber).trim(),
    }).select("_id");

    if (existingRegistration) {
      res.status(409).json({
        success: false,
        duplicate: true,
        message:
          "This mobile number is already registered with this Employee ID. Please use a different mobile number.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      duplicate: false,
    });
  } catch (error) {
    console.error("Duplicate registration check error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to check registration details.",
    });
  }
};

/*
 * ============================================================
 * CREATE REGISTRATION
 * ============================================================
 */
export const createRegistration = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const registration = await Registration.create(req.body);
     console.log("=================================");
    console.log("REGISTRATION SAVED");
    console.log("MongoDB ID:", registration._id);
    console.log("Database:", Registration.db.name);
    console.log("Collection:", Registration.collection.name);
    console.log("=================================");


    res.status(201).json({
      success: true,
      message: "Registration submitted successfully.",
      data: registration,
    });
  } catch (error:any) {
    console.error("Registration creation error:", error);

    // Duplicate Employee ID + Mobile Number
    if (error?.code === 11000) {
      res.status(409).json({
        success: false,
        message:
          "This mobile number is already registered with this Employee ID. Please use a different mobile number.",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit registration.",
    });
  }
};


/*
 * ============================================================
 * GET ALL REGISTRATIONS
 * ============================================================
 */
// export const getRegistrations = async (
//   _req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const registrations = await Registration.find()
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json({
//       success: true,
//       count: registrations.length,
//       data: registrations,
//     });
//   } catch (error) {
//     console.error("Failed to fetch registrations:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch registrations.",
//     });
//   }
// };

export const getRegistrations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1,
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100,
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const organization =
      typeof req.query.organization === "string"
        ? req.query.organization.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status.trim()
        : "";

    const device =
      typeof req.query.device === "string"
        ? req.query.device.trim()
        : "";

    /*
     * ========================================================
     * BUILD FILTER
     * ========================================================
     */

    const filter: Record<string, unknown> = {};

    /*
     * Search
     *
     * Searches:
     * - Full name
     * - Employee ID
     * - Email
     * - Mobile number
     */

    if (search) {
      filter.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          employeeId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          institutionEmail: {
            $regex: search,
            $options: "i",
          },
        },
        {
          mobileNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /*
     * Organization
     */

    if (organization) {
      filter["organization.name"] = organization;
    }

    /*
     * Status
     */

    if (
      status === "pending" ||
      status === "approved" ||
      status === "rejected"
    ) {
      filter.status = status;
    }

    /*
     * Device
     */

    if (device === "laptop") {
      filter["devices.laptop.requested"] = true;
    }

    if (device === "smartphone") {
      filter["devices.smartphone.requested"] = true;
    }

    /*
     * ========================================================
     * PAGINATION
     * ========================================================
     */

    const skip = (page - 1) * limit;

    const [
      registrations,
      total,
      totalRegistrations,
      pending,
      approved,
      rejected,
    ] = await Promise.all([
      Registration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Registration.countDocuments(filter),
       Registration.countDocuments(),

      Registration.countDocuments({
        // ...filter,
        status: "pending",
      }),

      Registration.countDocuments({
        // ...filter,
        status: "approved",
      }),

      Registration.countDocuments({
        // ...filter,
        status: "rejected",
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,

      count: registrations.length,

      total,
      totalRegistrations,

      page,

      limit,

      totalPages,

      statusCounts: {
        pending,
        approved,
        rejected,
      },

      data: registrations,
    });
  } catch (error) {
    console.error(
      "Failed to fetch registrations:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations.",
    });
  }
};


/*
     * ========================================================
     * EXPORT REGISTRATIONS
     * ========================================================
     */

export const exportRegistrations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      search = "",
      organization = "",
      status = "",
      device = "",
    } = req.query;
console.log("========== EXCEL EXPORT ==========");
console.log("search:", search);
console.log("organization:", organization);
console.log("status:", status);
console.log("device:", device);


    const filter: Record<string, unknown> = {};

    // Search
    if (search) {
      const searchRegex = {
        $regex: String(search),
        $options: "i",
      };

      filter.$or = [
        { fullName: searchRegex },
        { employeeId: searchRegex },
        { institutionEmail: searchRegex },
        { mobileNumber: searchRegex },
        { designation: searchRegex },
        { divisionGroup: searchRegex },
        { place: searchRegex },
        { "organization.name": searchRegex },
      ];
    }

    // Organization filter
    if (
  organization &&
  organization !== "all"
) {
  filter["organization.name"] = String(
    organization,
  );
}

    // Status filter
    if (
  status &&
  status !== "all"
) {
  filter.status = String(status);
}

    // Device filter
    if (
  device &&
  device !== "all"
) {
  if (device === "laptop") {
    filter["devices.laptop.requested"] = true;
  }

  if (device === "smartphone") {
    filter["devices.smartphone.requested"] = true;
  }
}

    const registrations = await Registration.find(
      filter,
    )
      .sort({ createdAt: -1 })
      .lean();


      console.log(
  "Export filter:",
  JSON.stringify(filter, null, 2),
);

console.log(
  "Export registrations count:",
  registrations.length,
);

console.log("=================================");

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "CSIR-NGRI";
    workbook.created = new Date();

    const worksheet =
      workbook.addWorksheet("Registrations");

    worksheet.columns = [
      {
        header: "S.No",
        key: "sno",
        width: 8,
      },
      {
        header: "Full Name",
        key: "fullName",
        width: 25,
      },
      {
        header: "Employee ID",
        key: "employeeId",
        width: 18,
      },
      {
        header: "Designation",
        key: "designation",
        width: 22,
      },
      {
        header: "Email",
        key: "email",
        width: 32,
      },
      {
        header: "Mobile Number",
        key: "mobileNumber",
        width: 18,
      },
      {
        header: "Organization",
        key: "organization",
        width: 30,
      },
      {
        header: "Division / Group",
        key: "divisionGroup",
        width: 25,
      },
      {
        header: "Laptop",
        key: "laptop",
        width: 12,
      },
      {
        header: "Laptop OS",
        key: "laptopOS",
        width: 18,
      },
      {
        header: "Laptop MAC",
        key: "laptopMAC",
        width: 22,
      },
      {
        header: "Smartphone",
        key: "smartphone",
        width: 15,
      },
      {
        header: "Smartphone OS",
        key: "smartphoneOS",
        width: 20,
      },
      {
        header: "Smartphone MAC",
        key: "smartphoneMAC",
        width: 22,
      },
      {
        header: "Guesthouse",
        key: "guesthouse",
        width: 15,
      },
      {
        header: "Guesthouse Name",
        key: "guesthouseName",
        width: 25,
      },
      {
        header: "Room Number",
        key: "roomNumber",
        width: 15,
      },
      {
        header: "Date",
        key: "date",
        width: 15,
      },
      {
        header: "Place",
        key: "place",
        width: 20,
      },
      {
        header: "Status",
        key: "status",
        width: 15,
      },
      {
        header: "Submitted At",
        key: "createdAt",
        width: 22,
      },
    ];

    registrations.forEach(
      (registration, index) => {
        worksheet.addRow({
          sno: index + 1,

          fullName: registration.fullName,

          employeeId: registration.employeeId,

          designation: registration.designation,

          email: registration.institutionEmail,

          mobileNumber: registration.mobileNumber,

          organization:
            registration.organization?.name || "",

          divisionGroup:
            registration.divisionGroup,

          laptop:
            registration.devices?.laptop?.requested
              ? "Yes"
              : "No",

          laptopOS:
            registration.devices?.laptop
              ?.operatingSystem || "",

          laptopMAC:
            registration.devices?.laptop
              ?.macAddress || "",

          smartphone:
            registration.devices?.smartphone
              ?.requested
              ? "Yes"
              : "No",

          smartphoneOS:
            registration.devices?.smartphone
              ?.operatingSystem || "",

          smartphoneMAC:
            registration.devices?.smartphone
              ?.macAddress || "",

          guesthouse:
            registration.guesthouse?.staying
              ? "Yes"
              : "No",

          guesthouseName:
            registration.guesthouse?.name || "",

          roomNumber:
            registration.guesthouse?.roomNumber ||
            "",

          date: registration.date,

          place: registration.place,

          status: registration.status,

          createdAt: registration.createdAt
            ? new Date(
                registration.createdAt,
              ).toLocaleString("en-IN")
            : "",
        });
      },
    );

    // Header formatting
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    headerRow.height = 25;

    // Freeze header row
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // Add borders and alignment
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          wrapText: true,
        };

        cell.border = {
          top: {
            style: "thin",
          },
          left: {
            style: "thin",
          },
          bottom: {
            style: "thin",
          },
          right: {
            style: "thin",
          },
        };
      });

      if (rowNumber > 1) {
        row.height = 22;
      }
    });

    const filename = `NGRI_WiFi_Registrations_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error(
      "Registration Excel export error:",
      error,
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message:
          "Failed to export registrations.",
      });
    }
  }
};

/*
 * ============================================================
 * UPDATE REGISTRATIONS
 * ============================================================
 */


export const updateRegistrationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid registration status.",
      });

      return;
    }

    const registration =
      await Registration.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: `Registration ${status} successfully.`,
      data: registration,
    });
  } catch (error) {
    console.error(
      "Registration status update error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to update registration status.",
    });
  }
};