import { TODO } from "@squared/context";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { router } from "../__internals/router";
import { publicProcedure } from "../procedures";

export const authRouter = router({
	register: publicProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				externalId: z.string(),
				username: z.string(),
				inviteToken: z.string().optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { authService } = ctx;
			const { name, email, externalId, username, inviteToken } = input;
			const { user, message } = await authService.register(TODO, {
				name,
				email,
				externalId,
				username,
				inviteToken,
			});

			if (!user) {
				throw new HTTPException(400, { message });
			}

			return c.json({ title: message });
		}),
});
