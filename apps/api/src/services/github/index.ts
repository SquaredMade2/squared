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
	upsertPullRequest: {
		input: z.object({
			id: z.string(),
			number: z.number(),
			state: z.enum(["open", "closed"]),
			title: z.string(),
			url: z.string(),
			branch: z.string(),
			body: z.string(),
			author: z.string(),
			repoId: z.string(),
		}),
		output: z.void(),
	},
});

export type GithubRpcSchema = typeof githubRpcSchema;

export const createGithubRpcHandler = (githubService: GithubService) =>
	createRpcHandler("github", githubRpcSchema, {
		getUserRepositories: (input) => githubService.getUserRepositories(input),
		upsertPullRequest: (input) => githubService.upsertPullRequest(input),
	});
