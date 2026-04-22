import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = authSchema.extend({
  fullName: z.string().min(2),
});

export const onboardingSchema = z.object({
  fullName: z.string().min(2),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, and underscores.")
    .transform((value) => value.trim().toLowerCase()),
  region: z.string().min(2),
  roles: z.array(z.enum(["player", "spectator", "organizer"])).min(1),
  favoriteSportIds: z.array(z.string()).min(1),
  bio: z.string().max(240).optional(),
});

export const eventSchema = z.object({
  title: z.string().min(4),
  sportId: z.string().min(1),
  city: z.string().min(2),
  region: z.string().min(2),
  venue: z.string().min(2),
  eventType: z.enum(["community", "club", "showcase"]),
  status: z.enum(["draft", "published", "completed", "cancelled"]),
  entryFeeText: z.string().min(2),
  description: z.string().min(20),
  startsAt: z.string().min(1),
  capacity: z.coerce.number().int().min(1).max(500),
});
