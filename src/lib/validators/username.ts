
import { z } from "zod";

export const UsernameValidator = z.object({
     username: z.string().min(5).max(18).regex(/^[a-zA-Z0-9_]+$/).optional(),
});

export type UsernameRequest = z.infer<typeof UsernameValidator>;