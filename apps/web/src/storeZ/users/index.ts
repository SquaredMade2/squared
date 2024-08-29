import {
	get as axiosGet,
	post as axiosPost,
	put as axiosPut,
	delete as axiosDelete,
} from "axios";
import { createStore } from "zustand/vanilla";
import type { UserState, UserStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/user/${path}`;

export const createUserStore = (initState: UserState = { users: [] }) => {
	return createStore<UserStore>()((set) => ({
		...initState,
		addUser: (user) => async (state) => {
			const response = await axiosPost(apiString(uuidv4()), user);
			set({ users: [...state.users, response.data] });
			return response.data;
		},
		updateUser: (userId, user) => async (state) => {
			const response = await axiosPut(apiString(userId), user);
			set({
				users: state.users.map((user) =>
					user.id === userId ? response.data : user,
				),
			});
			return response.data;
		},
		deleteUser: (userId) => async (state) => {
			await axiosDelete(apiString(userId));
			set({
				users: state.users.filter((user) => user.id !== userId),
			});
		},
		getUser: (userId) => async (state) => {
			const existing = state.users.find((user) => user.id === userId);
			if (existing) return existing;
			const response = await axiosGet(apiString(userId));
			return response.data;
		},
		getAllUsers: (workspaceId) => async () => {
			const response = await axiosGet(
				`${process.env.SERVER_URL}/api/workspace/${workspaceId}/user`,
			);
			set({ users: response.data });
			return response.data;
		},
	}));
};
