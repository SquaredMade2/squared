import axios from "axios";
import { createStore } from "zustand/vanilla";
import type { UserState, UserStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import { useUserStore } from "../provider";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/user/${path}`;

export const createUserStore = (initState: UserState = { users: [] }) => {
	return createStore<UserStore>()(
		persist(
			(set) => ({
				...initState,
				addUser: async (user) => {
					const response = await axios.post(apiString(uuidv4()), user);
					const { users } = useUserStore();
					set({ users: [...users, response.data] });
					return response.data;
				},
				updateUser: async (userId, user) => {
					const response = await axios.put(apiString(userId), user);
					const { users } = useUserStore();
					set({
						users: users.map((user) =>
							user.id === userId ? response.data : user,
						),
					});
					return response.data;
				},
				deleteUser: async (userId) => {
					await axios.delete(apiString(userId));
					const { users } = useUserStore();
					set({
						users: users.filter((user) => user.id !== userId),
					});
				},
				getUser: async (userId) => {
					const { users } = useUserStore();
					const existing = users.find((user) => user.id === userId);
					if (existing) return existing;
					const response = await axios.get(apiString(userId));
					return response.data;
				},
				getAllUsers: async (workspaceId) => {
					const response = await axios.get(
						`${process.env.SERVER_URL}/api/workspace/${workspaceId}/user`,
					);
					set({ users: response.data });
					return response.data;
				},
			}),
			{
				name: "user-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
