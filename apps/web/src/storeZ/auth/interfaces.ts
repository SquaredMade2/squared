import type { User } from "@repo/db";

export type AuthState = {
	user: User | null;
};

export type AuthActions = {
	login: (userId: User) => (state: AuthState) => Promise<User | undefined>;
	register: (userId: string) => (state: AuthState) => Promise<User | undefined>;
	verifyUser: (
		token: string,
	) => (state: AuthState) => Promise<User | undefined>;
	logout: () => (state: AuthState) => Promise<void>;
	resetPassword: (email: string) => (state: AuthState) => Promise<void>;
	getGithubAccessToken: (code: string) => (state: AuthState) => Promise<void>;
};

export type AuthStore = AuthState & AuthActions;
