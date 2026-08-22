import { z } from 'zod';

// The backend takes a single "identifier" (email or username), so this
// deliberately isn't validated as an email format — a valid username
// would fail that check.
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Email or username is required.')
    .max(254, "That's too long."),
  password: z.string().min(1, 'Password is required.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
