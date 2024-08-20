import type { User } from "@repo/db";

export type AuthState = {
	user: User | null;
};

export type Login = {
	provider: "credentials" | "oauth";
	type: "register" | "login";
	email: string;
	password?: string;
	name?: string;
	username?: string;
};

export type AuthActions = {
	login: (userId: string, login: Login) => () => Promise<User | null>;
	register: (login: Login) => () => Promise<User | null>;
	verifyUser: (token: string) => () => Promise<User | null>;
	logout: () => () => Promise<boolean>;
	resetPassword: (email: string) => () => Promise<boolean>;
};

export type AuthStore = AuthState & AuthActions;
