import type { User } from "@repo/db";

export type AuthState = {
	user: User | null;
};

export type AuthReturn = {
	data: {
		user: User | null;
		message: string;
		variant: "destructive" | "default";
	};
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
	login: (login: Login) => Promise<AuthReturn["data"]>;
	register: (login: Login) => Promise<AuthReturn["data"]>;
	verifyUser: (token: string) => Promise<AuthReturn["data"]>;
	logout: () => Promise<boolean>;
	resetPassword: (email: string) => Promise<boolean>;
};

export type AuthStore = AuthState & AuthActions;
