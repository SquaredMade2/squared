import type { User } from "@squared/db";

export type UserAvatar = {
	id: string;
	name: string;
	avatarUrl: string | null;
};

export type UserState = {
	user: User | null;
	users: User[];
	userAvatars: UserAvatar[];
	connectedRepos: string[];
};

type UserActions = {
	setUser: (user: User | null) => void;
	setUsers: (users: User[]) => void;
	setUserAvatars: (avatars: UserAvatar[]) => void;
	setConnectedRepos: (repos: string[]) => void;
	updateUser: (user: User) => void;
};

export type UserStore = UserState & UserActions;
