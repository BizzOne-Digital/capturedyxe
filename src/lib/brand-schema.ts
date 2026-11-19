import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().trim().min(1),
  logoUrl: z.string().optional(),
  industry: z.string().optional(),
  eventType: z.string().optional(),
  location: z.string().optional(),
  eventDate: z.string().optional(),
  description: z.string().optional(),
  websiteUrl: z.string().trim().optional(),
  photos: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
  order: z.number().optional(),
});
