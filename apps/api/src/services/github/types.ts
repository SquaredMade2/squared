export interface GithubRpc {
	getUserRepositories: (args: { userId: string }) => Promise<string[]>;
	upsertPullRequest: (args: {
		id: string;
		number: number;
		state: "open" | "closed";
		title: string;
		url: string;
		branch: string;
		body: string;
		author: string;
		repoId: string;
		timestamp: string;
	}) => Promise<void>;
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
