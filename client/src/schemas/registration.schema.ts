import { z } from 'zod';

const macAddressRegex =
  /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const mobileRegex = /^[6-9]\d{9}$/;

const laptopSchema = z
  .object({
    requested: z.boolean(),
    operatingSystem: z
      .enum(['Windows', 'Linux', 'macOS'])
      .optional(),
    macAddress: z.string().optional(),
  })
  .superRefine((device, ctx) => {
    if (!device.requested) return;

    if (!device.operatingSystem) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['operatingSystem'],
        message: 'Please select your laptop operating system.',
      });
    }

    if (!device.macAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['macAddress'],
        message: 'Please enter your laptop MAC address.',
      });
    } else if (!macAddressRegex.test(device.macAddress)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['macAddress'],
        message: 'Enter a valid MAC address.',
      });
    }
  });

const smartphoneSchema = z
  .object({
    requested: z.boolean(),
    operatingSystem: z
      .enum(['Android', 'iOS'])
      .optional(),
    macAddress: z.string().optional(),
  })
  .superRefine((device, ctx) => {
    if (!device.requested) return;

    if (!device.operatingSystem) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['operatingSystem'],
        message: 'Please select your smartphone operating system.',
      });
    }

    if (!device.macAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['macAddress'],
        message: 'Please enter your smartphone MAC address.',
      });
    } else if (!macAddressRegex.test(device.macAddress)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['macAddress'],
        message: 'Enter a valid MAC address.',
      });
    }
  });

const guesthouseSchema = z
  .object({
    staying: z.boolean(),
    name: z.enum(['IICT', 'NGRI', 'CCMB']).optional(),
    roomNumber: z.string().trim().optional(),
  })
  .superRefine((guesthouse, ctx) => {
    if (!guesthouse.staying) return;

    if (!guesthouse.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: 'Please select your guesthouse.',
      });
    }

    if (!guesthouse.roomNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['roomNumber'],
        message: 'Please enter your room number.',
      });
    }
  });

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Please enter your full name.'),

    designation: z
      .string()
      .trim()
      .min(2, 'Please enter your designation.'),

    employeeId: z
      .string()
      .trim()
      .min(1, 'Please enter your employee ID.'),

    institutionEmail: z
      .string()
      .trim()
      .email('Please enter a valid institutional email address.'),

    mobileNumber: z
      .string()
      .trim()
      .regex(
        mobileRegex,
        'Please enter a valid 10-digit mobile number.'
      ),

    organization: z.object({
      id: z.number(),
      name: z.string().min(1),
    }),

    otherOrganizationName: z
      .string()
      .trim()
      .optional(),

    divisionGroup: z
      .string()
      .trim()
      .min(1, 'Please enter your division/group.'),

    devices: z
      .object({
        laptop: laptopSchema,
        smartphone: smartphoneSchema,
      })
      .superRefine((devices, ctx) => {
        if (
          !devices.laptop.requested &&
          !devices.smartphone.requested
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['laptop'],
            message: 'Please select at least one device.',
          });
        }
      }),

    guesthouse: guesthouseSchema,

    date: z
  .string()
  .min(1, 'Please select the registration date.')
  .refine(
    (value) => {
      const selectedDate = new Date(`${value}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      return selectedDate <= today;
    },
    'Registration date cannot be in the future.'
  ),

    place: z
      .string()
      .trim()
      .min(2, 'Please enter the place.'),

    declarationAccepted: z
      .boolean()
      .refine(
        (value) => value === true,
        'You must accept the declaration before submitting.'
      ),
  })
  .superRefine((data, ctx) => {
    if (
      data.organization.id === 45 &&
      !data.otherOrganizationName
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherOrganizationName'],
        message: 'Please enter your organization name.',
      });
    }
  });

export type RegistrationFormData = z.infer<
  typeof registrationSchema
>;