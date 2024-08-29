import type { User } from "@repo/db";

export type UserState = {
	users: User[];
};

export type UserActions = {
	addUser: (user: User) => (state: UserState) => Promise<User>;
	updateUser: (
		userId: string,
		user: Partial<User>,
	) => (state: UserState) => Promise<User>;
	deleteUser: (userId: string) => (state: UserState) => void;
	getUser: (userId: string) => (state: UserState) => Promise<User | undefined>;
	getAllUsers: (workspaceId: string) => () => Promise<User[]>;
};

export type UserStore = UserState & UserActions;
