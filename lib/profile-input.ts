import { z } from "zod";

export const profileInputSchema = z.object({
  customerDescription: z.string().trim().default(""),
  industry: z.string().trim().min(1).default("General"),
  companySize: z.string().trim().min(1).default("SMB"),

  remoteWorkforce: z.boolean().default(true),
  physicalOfficeControl: z.boolean().default(false),
  softwareDevelopment: z.boolean().default(true),
  cloudHosted: z.boolean().default(true),

  personalDataProcessing: z.boolean().default(true),
  specialCategoryData: z.boolean().default(false),
  paymentProcessing: z.boolean().default(false),
  regulatedMarket: z.boolean().default(false),

  suppliersCritical: z.boolean().default(true),
  businessContinuityRequired: z.boolean().default(true),
  mobileDevicesUsed: z.boolean().default(true),
  privilegedAccessManaged: z.boolean().default(true),
  securityMonitoringNeeded: z.boolean().default(true),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;

export const EMPTY_PROFILE: ProfileInput = {
  customerDescription: "",
  industry: "General",
  companySize: "SMB",

  remoteWorkforce: true,
  physicalOfficeControl: false,
  softwareDevelopment: true,
  cloudHosted: true,

  personalDataProcessing: true,
  specialCategoryData: false,
  paymentProcessing: false,
  regulatedMarket: false,

  suppliersCritical: true,
  businessContinuityRequired: true,
  mobileDevicesUsed: true,
  privilegedAccessManaged: true,
  securityMonitoringNeeded: true,
};

export function parseProfileInput(input: unknown): ProfileInput {
  return profileInputSchema.parse(input);
}
