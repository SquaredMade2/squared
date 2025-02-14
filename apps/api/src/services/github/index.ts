import { createRpcHandler, createServiceSchema } from "@squared/rpc";
import z from "zod";
import type { GithubService } from "./github-service";
import type { GithubRpc } from "./types";

export const githubRpcSchema = createServiceSchema<GithubRpc>()({
	getUserRepositories: {
		input: z.object({
			userId: z.string(),
		}),
		output: z.array(z.string()),
	},
});

export type GithubRpcSchema = typeof githubRpcSchema;

export const createGithubRpcHandler = (githubService: GithubService) =>
	createRpcHandler("github", githubRpcSchema, {
		getUserRepositories: (input) => githubService.getUserRepositories(input),
	});
