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
).strict();

const registerSchema = createSchema<Register>()(
	z.object({
		email: z.string(),
		password: z.string(),
		name: z.string(),
		username: z.string(),
		inviteToken: z.string().optional(),
	}),
).strict();

const oAuthLoginSchema = createSchema<OauthLogin>()(
	z.object({
		email: z.string(),
		oauthId: z.string(),
		name: z.string().optional(),
		username: z.string().optional(),
		avatarUrl: z.string().nullable().optional(),
	}),
).strict();

const userTokenSchema = createSchema<UserToken>()(
	z.object({
		user: userSchema,
		token: z.string(),
	}),
).strict();

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
		output: z.object({
			user: userSchema.nullable(),
			message: z.string().optional(),
			variant: z.enum(["default", "destructive"]).nullable().optional(),
		}),
	},
	verifyUser: {
		input: z.object({ token: z.string() }).strict(),
		output: userSchema.nullable(),
	},
	resetPasswordEmail: {
		input: z.object({ email: z.string() }).strict(),
		output: z.void(),
	},
	resetPassword: {
		input: z.object({ token: z.string(), newPassword: z.string() }).strict(),
		output: z.void(),
	},
	checkTokenValid: {
		input: z.object({ token: z.string() }).strict(),
		output: z
			.object({
				email: z.string(),
				message: z.string(),
			}).strict().nullable(),
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
