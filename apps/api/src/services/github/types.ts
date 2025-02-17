import type { GithubRepo } from "@squared/db";

export interface UpsertPullRequestResponse {
	tasks: {
		identifier: string;
		url: string;
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
		repo: Omit<GithubRepo, "externalId">;
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
