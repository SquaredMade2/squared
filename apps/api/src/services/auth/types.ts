import type { User } from "@squaredmade/db";

export type Register = {
	email: string;
	externalId: string;
	name: string;
	username: string;
};

export type RegisterReturn = {
	user: User | null;
	message?: string;
	variant?: "default" | "destructive" | null | undefined;
};

export interface AuthRpc {
	register: (login: Register) => Promise<RegisterReturn>;
}
