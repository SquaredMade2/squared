import type { GithubOrg, GithubRepo } from "@squared/db";

export interface UpsertPullRequestResponse {
	tasks: {
		identifier: string;
		url: string;
		title: string;
	}[];
}

export interface GithubRpc {
	getWorkspaceRepositories: (args: { workspaceId: string }) => Promise<
		string[]
	>;
	upsertPullRequest: (args: {
		id: string;
		number: number;
		state: "open" | "closed";
		title: string;
		url: string;
		branch: string;
		body: string;
		author: string;
		timestamp: string;
		// Omitting externalIds as it makes more sense on the other end to be sending over a param called "id"
		repo: Omit<GithubRepo, "externalId">;
		org: Omit<GithubOrg, "externalId" | "workspaceId">;
	}) => Promise<UpsertPullRequestResponse>;
	pushCommit: (args: {
		id: string;
		message: string;
		url: string;
		author: string;
		repoId: string;
		branch: string;
		timestamp: string;
	}) => Promise<void>;
}
