import { z } from "zod";

export const languageSchema = z.enum(["hi", "en", "hinglish", "mr"]).default("hi");

export const locationSchema = z.object({
  name: z.string().min(1).optional(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string().min(1),
  elevation: z.number().optional()
});

export const birthInputSchema = z.object({
  name: z.string().min(1).optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  location: locationSchema
});

export const kundliReportRequestSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  location: locationSchema,
  language: languageSchema,
  request_full_report: z.boolean().optional().default(false),
  mode: z.enum(["summary", "detailed"]).optional().default("summary"),
  user_id: z.string().optional()
});

export const compatibilityReportRequestSchema = z.object({
  partner_a: birthInputSchema,
  partner_b: birthInputSchema,
  language: languageSchema,
  request_full_report: z.boolean().optional().default(false),
  mode: z.enum(["summary", "detailed"]).optional().default("summary"),
  user_id: z.string().optional()
});

export type KundliReportRequest = z.infer<typeof kundliReportRequestSchema>;
export type CompatibilityReportRequest = z.infer<typeof compatibilityReportRequestSchema>;
