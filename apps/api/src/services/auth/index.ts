import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import z from "zod";
import { userSchema } from "../schema";
import type { AuthRpc, Login, OauthLogin, Register, UserToken } from "./types";

const loginSchema = createSchema<Login>()(
	z.object({
		email: z.string(),
		password: z.string(),
	}),
);

const registerSchema = createSchema<Register>()(
	z.object({
		email: z.string(),
		password: z.string(),
		name: z.string(),
		username: z.string(),
		inviteToken: z.string().optional(),
	}),
);

const oAuthLoginSchema = createSchema<OauthLogin>()(
	z.object({
		email: z.string(),
		oauthId: z.string(),
		name: z.string(),
		username: z.string(),
		avatarUrl: z.string(),
	}),
);

const userTokenSchema = createSchema<UserToken>()(
	z.object({
		user: userSchema,
		token: z.string(),
	}),
);

export const authRpcSchema = createServiceSchema<AuthRpc>()({
	login: {
		input: loginSchema,
		output: userTokenSchema.nullable(),
	},
	googleLogin: {
		input: oAuthLoginSchema,
		output: userTokenSchema.nullable(),
	},
	register: {
		input: registerSchema,
		output: userSchema.nullable(),
	},
	verifyUser: {
		input: z.object({ token: z.string() }),
		output: userSchema.nullable(),
	},
	resetPasswordEmail: {
		input: z.object({ email: z.string() }),
		output: z.void(),
	},
	resetPassword: {
		input: z.object({ token: z.string(), newPassword: z.string() }),
		output: z.void(),
	},
	checkTokenValid: {
		input: z.object({ token: z.string() }),
		output: z.void(),
	},
});

export type AuthRpcSchema = typeof authRpcSchema;

export const createAuthRpcHandler = (authService: AuthRpc) =>
	createRpcHandler("auth", authRpcSchema, {
		login: (input) => authService.login(input),
		googleLogin: (input) => authService.googleLogin(input),
		register: (input) => authService.register(input),
		verifyUser: (input) => authService.verifyUser(input),
		resetPasswordEmail: (input) => authService.resetPasswordEmail(input),
		resetPassword: (input) => authService.resetPassword(input),
		checkTokenValid: (input) => authService.checkTokenValid(input),
	});
