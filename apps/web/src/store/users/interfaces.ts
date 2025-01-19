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
	setUsers: (users: User[]) => void;
	setUserAvatars: (avatars: UserAvatar[]) => void;
	setConnectedRepos: (repos: string[]) => void;
};

export type UserStore = UserState & UserActions;
