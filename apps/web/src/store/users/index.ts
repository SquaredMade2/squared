import type { User } from "@squared/db";
import { createStore } from "zustand/vanilla";
import type { UserAvatar, UserState, UserStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createUserStore = (
	initState: UserState = {
		users: [],
		userAvatars: [],
		connectedRepos: [],
		user: null,
	},
) => {
	return createStore<UserStore>()((set) => ({
		...initState,
		setUser: (user: User | null) => set({ user }),
		setUsers: (users: User[]) => set({ users }),
		setUserAvatars: (userAvatars: UserAvatar[]) => set({ userAvatars }),
		setConnectedRepos: (connectedRepos: string[]) => set({ connectedRepos }),
	}));
};
