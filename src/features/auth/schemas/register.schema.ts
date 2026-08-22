import { z } from 'zod';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .regex(EMAIL_REGEX, 'Please enter a valid email address.'),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters.')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
