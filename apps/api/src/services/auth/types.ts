import type { User } from "@squared/db";

export type Login = {
	email: string;
	password: string;
};

export type Register = {
	email: string;
	externalId: string;
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
	register: (login: Register) => Promise<RegisterReturn>;
}
