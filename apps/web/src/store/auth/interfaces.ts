import type { User } from "@repo/db";

export type AuthState = {
	user: User | null;
};

export type AuthReturn = {
	user: User | null;
	message: string;
	variant: "destructive" | "default";
};

export type Login = {
	provider: "credentials" | "oauth";
	type: "register" | "login";
	email: string;
	password?: string;
	name?: string;
	username?: string;
};

type AuthActions = {
	login: (login: Login) => Promise<AuthReturn>;
	register: (login: Login) => Promise<AuthReturn>;
	verifyUser: (token: string) => Promise<AuthReturn>;
	logout: () => Promise<boolean>;
	resetPassword: (email: string) => Promise<boolean>;
	setUser: (user: User | null) => void;
};

export type AuthStore = AuthState & AuthActions;
