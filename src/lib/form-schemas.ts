import { z } from "zod";

export const socialLinksSchema = z.object({
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  extra: z.string().optional(),
});

export const registartionSchema = z.object({
  // Step 1
  firstName: z
    .string()
    .min(3, { message: "First name is required" })
    .optional(),
  lastName: z.string().min(3, { message: "Last name is required" }).optional(),
  blogSubdomain: z
    .string()
    .min(3, { message: "Blog handle must be at least 3 characters long" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Blog handle can only contain lowercase letters, numbers, and hyphens",
    })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .optional(),

  // Step 2
  headline: z.string().max(120).optional(),
  bio: z.string().max(360).optional(),
  location: z
    .string()
    .max(25, { message: "Location must be at most 25 characters long" })
    .optional(),
  socialLinks: socialLinksSchema.optional(),
});
