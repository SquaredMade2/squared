import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import z from "zod";
import { userSchema } from "../schema";
import type { AuthRpc, Register } from "./types";

const registerSchema = createSchema<Register>()(
	z.object({
		email: z.string(),
		externalId: z.string(),
		name: z.string(),
		username: z.string(),
		inviteToken: z.string().optional(),
	}),
);

export const authRpcSchema = createServiceSchema<AuthRpc>()({
	register: {
		input: registerSchema,
		output: z.object({
			user: userSchema.nullable(),
			message: z.string().optional(),
			variant: z.enum(["default", "destructive"]).nullable().optional(),
		}),
	},
});

export type AuthRpcSchema = typeof authRpcSchema;

export const createAuthRpcHandler = (authService: AuthRpc) =>
	createRpcHandler("auth", authRpcSchema, {
		register: (input) => authService.register(input),
	});
