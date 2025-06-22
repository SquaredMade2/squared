import type { User } from "@squaredmade/db";
import { createStore } from "zustand/vanilla";
import type { UserAvatar, UserState, UserStore } from "./interfaces";

export type { UserAvatar, UserState, UserStore } from "./interfaces";
export { UserStoreProvider, useUserStore } from "./store";

export const createUserStore = (
	initState: UserState = {
		connectedRepos: [],
		user: null,
		userAvatars: [],
		users: [],
	},
) => {
	return createStore<UserStore>()((set) => ({
		...initState,
		setConnectedRepos: (connectedRepos: string[]) => set({ connectedRepos }),
		setUser: (user: User | null) => set({ user }),
		setUserAvatars: (userAvatars: UserAvatar[]) => set({ userAvatars }),
		setUsers: (users: User[]) => set({ users }),
	}));
};
