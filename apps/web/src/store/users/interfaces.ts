import type { User } from "@repo/db";

export type UserAvatar = {
	id: string;
	name: string;
	avatarUrl: string | null;
};

export type UserState = {
	users: User[];
	userAvatars: UserAvatar[];
};

export interface UserResponse {
	user: User | null;
	message?: string;
	variant: "default" | "destructive";
}

type UserActions = {
	addUser: (user: Partial<User>) => Promise<UserResponse>;
	updateUser: (userId: string, user: Partial<User>) => Promise<UserResponse>;
	deleteUser: (userId: string) => Promise<void>;
	getUser: (userId: string) => Promise<UserResponse>;
	getAllUsers: (workspaceId: string) => Promise<User[]>;
	getUserAvatars: (userId: string) => Promise<UserAvatar[]>;
};

export type UserStore = UserState & UserActions;
