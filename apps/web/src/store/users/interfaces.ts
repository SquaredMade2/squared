import type { User } from "@repo/db";

export type UserState = {
	users: User[];
};

export interface UserResponse {
	user: User | null;
	message?: string;
	variant: "default" | "destructive";
}

export type UserActions = {
	addUser: (user: Partial<User>) => Promise<UserResponse>;
	updateUser: (userId: string, user: Partial<User>) => Promise<UserResponse>;
	deleteUser: (userId: string) => Promise<void>;
	getUser: (userId: string) => Promise<UserResponse>;
	getAllUsers: (workspaceId: string) => Promise<User[]>;
};

export type UserStore = UserState & UserActions;
