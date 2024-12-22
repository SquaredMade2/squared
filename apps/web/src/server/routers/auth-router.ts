import { TODO } from "@squared/context";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure, publicProcedure } from "../procedures";

export const authRouter = router({
	checkValidToken: privateProcedure
		.input(z.object({ token: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { authService } = ctx;
			const { token } = input;
			const response = await authService.checkTokenValid(TODO, { token });
			if (response && response.message === "Token is expired or invalid") {
				return c.json({
					email: response.email ?? "",
					message: response.message,
					tokenExpired: true,
				});
			}
			return c.json({
				message: "Token is valid",
				email: "",
				tokenExpired: false,
			});
		}),

	resetPassword: privateProcedure
		.input(
			z.object({
				token: z.string(),
				newPassword: z.string(),
				confirmPassword: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { authService } = ctx;
			const { token, newPassword, confirmPassword } = input;

			if (confirmPassword !== newPassword)
				throw new HTTPException(400, {
					message: "Passwords don't match.",
				});
			await authService.resetPassword(TODO, { token, newPassword });
			return c.json({ title: "Password reset successfully" });
		}),

	resetPasswordEmail: privateProcedure
		.input(z.object({ email: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { authService } = ctx;
			const { email } = input;
			await authService.resetPasswordEmail(TODO, { email });
			return c.json({ title: "Password reset email sent successfully" });
		}),

	register: publicProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				password: z.string(),
				username: z.string(),
				inviteToken: z.string().optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { authService } = ctx;
			const { name, email, password, username, inviteToken } = input;
			const { user, message } = await authService.register(TODO, {
				name,
				email,
				password,
				username,
				inviteToken,
			});

			if (!user) {
				throw new HTTPException(400, { message });
			}

			return c.json({ verified: user.verified, title: message });
		}),
});
