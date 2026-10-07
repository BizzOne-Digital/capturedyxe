import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  eventType: z.string().min(1).max(80),
  eventDate: z.string().optional().or(z.literal("")),
  message: z.string().min(10).max(5000),
  sourcePage: z.string().max(200).optional(),
  website: z.string().max(0).optional(), // honeypot
  idempotencyKey: z.string().min(8).max(64),
});

export const bookingSchema = z.object({
  eventType: z.string().min(1).max(80),
  eventDate: z.string().min(1),
  eventTimeLocal: z.string().min(1).max(20),
  venueName: z.string().max(200).optional().or(z.literal("")),
  venueAddress: z.string().max(500).optional().or(z.literal("")),
  venueNotConfirmed: z.boolean().optional(),
  guestCount: z.coerce.number().int().min(1).max(50000).optional(),
  packageId: z.string().optional().or(z.literal("")),
  packageHelp: z.boolean().optional(),
  addOnIds: z.array(z.string()).optional(),
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(40),
  notes: z.string().max(5000).optional().or(z.literal("")),
  sourcePage: z.string().max(200).optional(),
  website: z.string().max(0).optional(),
  idempotencyKey: z.string().min(8).max(64),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});
