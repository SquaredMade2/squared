import { createRpcHandler, createServiceSchema } from "@squared/rpc";
import z from "zod";
import { githubRepoSchema } from "../schema";
import type { GithubService } from "./github-service";
import type { GithubRpc } from "./types";

export const githubRpcSchema = createServiceSchema<GithubRpc>()({
	getWorkspaceOrganizations: {
		input: z.object({
			workspaceId: z.string(),
		}),
		output: z.array(
			z.object({
				name: z.string(),
				createdAt: z.date(),
			}),
		),
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
			repo: githubRepoSchema.omit({ externalId: true }),
			org: z.object({
				id: z.string(),
				name: z.string(),
				description: z.string().nullable(),
			}),
			timestamp: z.string(),
		}),
		output: z.object({
			tasks: z.array(
				z.object({
					identifier: z.string(),
					url: z.string(),
					title: z.string(),
				}),
			),
		}),
	},
	pushCommit: {
		input: z.object({
			id: z.string(),
			message: z.string(),
			url: z.string(),
			author: z.string(),
			repoId: z.string(),
			branch: z.string(),
			timestamp: z.string(),
		}),
		output: z.void(),
	},
});

export type GithubRpcSchema = typeof githubRpcSchema;

export const createGithubRpcHandler = (githubService: GithubService) =>
	createRpcHandler("github", githubRpcSchema, {
		getWorkspaceOrganizations: (input) =>
			githubService.getWorkspaceOrganizations(input),
		upsertPullRequest: (input) => githubService.upsertPullRequest(input),
		pushCommit: (input) => githubService.pushCommit(input),
	});
