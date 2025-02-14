export interface GithubRpc {
	getUserRepositories: (args: { userId: string }) => Promise<string[]>;
}
