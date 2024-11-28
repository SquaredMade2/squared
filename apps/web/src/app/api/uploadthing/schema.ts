import { z } from "zod";

export const avatarImageInputSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
	prevUrl: z.string().nullable(),
});
