import type { User } from "@squared/db";

export type Login = {
	email: string;
	password: string;
};

export type Register = {
	email: string;
	password: string;
	name: string;
	username: string;
	inviteToken?: string;
};

export type RegisterReturn = {
	user: User | null;
	message?: string;
	variant?: "default" | "destructive" | null | undefined;
};

export type OauthLogin = {
	email: string;
	oauthId: string;
	name?: string;
	username?: string;
	avatarUrl?: string | null;
};

export type UserToken = {
	user: User;
	token: string;
};

export type CheckTokenValidReturn = {
	email: string;
	message: string;
} | null;

export interface AuthRpc {
	login: (login: Login) => Promise<UserToken | null>;
	googleLogin: (login: OauthLogin) => Promise<UserToken | null>;
	register: (login: Register) => Promise<RegisterReturn>;
	verifyUser: ({ token }: { token: string }) => Promise<User | null>;
	resetPasswordEmail: ({
		email,
	}: { email: string }) => Promise<{ success: boolean }>;
	resetPassword: ({
		token,
		newPassword,
	}: { token: string; newPassword: string }) => Promise<{ success: boolean }>;
	checkTokenValid: ({
		token,
	}: { token: string }) => Promise<CheckTokenValidReturn>;
}
