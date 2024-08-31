import type { User } from "@repo/db";

export type UserState = {
	users: User[];
};

export type UserActions = {
	addUser: (user: User) => Promise<User>;
	updateUser: (userId: string, user: Partial<User>) => Promise<User>;
	deleteUser: (userId: string) => void;
	getUser: (userId: string) => Promise<User | undefined>;
	getAllUsers: (workspaceId: string) => Promise<User[]>;
};

export type UserStore = UserState & UserActions;
