import { z } from 'zod';

export const verifySchema = z.object({
  token: z.string().trim().min(1, 'Token is required.'),
});

export type VerifyFormValues = z.infer<typeof verifySchema>;
