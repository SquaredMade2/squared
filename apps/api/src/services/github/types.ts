import type { GithubOrg, GithubRepo } from "@squaredmade/db";

export interface UpsertPullRequestResponse {
	tasks: {
		identifier: string;
		url: string;
		title: string;
	}[];
}

export interface GithubRpc {
	getWorkspaceOrganizations: (args: { workspaceId: string }) => Promise<
		{ name: string; createdAt: Date }[]
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
		org: Omit<GithubOrg, "externalId" | "workspaceId" | "createdAt">;
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
	uploadOrg: (args: {
		id: string;
		name: string;
		description: string;
		workspaceId: string;
	}) => Promise<void>;
}
