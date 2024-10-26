import axios from "axios";
import { createStore } from "zustand/vanilla";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import type {
	UserState,
	UserStore,
	UserResponse,
	UserAvatar,
} from "./interfaces";
import type { User } from "@squared/db";
import type { ApiReturnType } from "../interfaces";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/user/${path}`;

export const createUserStore = (
	initState: UserState = { users: [], userAvatars: [], connectedRepos: [] },
) => {
	return createStore<UserStore>()(
		persist(
			(set, get) => ({
				...initState,
				addUser: async (user: Partial<User>): Promise<UserResponse> => {
					const userId = uuidv4();
					try {
						const response: { data: ApiReturnType<User> } = await axios.post(
							apiString(userId),
							{
								...user,
								id: userId,
							},
						);

						const { data: newUser, message, variant } = response.data;
						if (!newUser) {
							return { user: null, message, variant };
						}

						set((state) => ({
							...state,
							users: [...state.users, newUser],
						}));

						return { user: newUser, message, variant };
					} catch (error) {
						return {
							user: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				updateUser: async (
					userId: string,
					user: Partial<User>,
				): Promise<UserResponse> => {
					try {
						const response: { data: ApiReturnType<User> } = await axios.put(
							apiString(userId),
							user,
						);
						const updatedUser = response.data.data;
						if (!updatedUser) {
							return {
								user: null,
								message: response.data.message,
								variant: response.data.variant,
							};
						}
						set((state) => ({
							users: state.users.map((u) =>
								u.id === userId ? updatedUser : u,
							),
						}));

						return {
							user: updatedUser,
							message: response.data.message,
							variant: response.data.variant,
						};
					} catch (error) {
						return {
							user: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				deleteUser: async (userId: string): Promise<void> => {
					try {
						await axios.delete(apiString(userId));
						set((state) => ({
							users: state.users.filter((u) => u.id !== userId),
						}));
					} catch (error) {
						console.error("Error in deleteUser:", error);
					}
				},
				getUser: async (userId: string): Promise<UserResponse> => {
					const { users } = get();
					const existingUser = users.find((u) => u.id === userId);
					if (existingUser) {
						return {
							user: existingUser,
							message: "User found",
							variant: "default",
						};
					}

					try {
						const response: { data: ApiReturnType<User> } = await axios.get(
							apiString(userId),
						);
						return { ...response.data, user: response.data.data };
					} catch (error) {
						return {
							user: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				getAllUsers: async (workspaceId: string): Promise<User[]> => {
					try {
						const { data: response }: { data: ApiReturnType<User[]> } =
							await axios.get(
								`${process.env.NEXT_PUBLIC_SERVER}/api/workspace/${workspaceId}/user`,
							);
						const { data: users } = response;
						if (!users) {
							set({ users: [] });
							return [];
						}
						set({ users });
						return users;
					} catch (error) {
						console.error("Error in getAllUsers:", error);
						return [];
					}
				},
				getUserAvatars: async (userId: string): Promise<UserAvatar[]> => {
					const { userAvatars } = get();
					if (userAvatars) {
						return userAvatars;
					}

					try {
						const response: {
							data: ApiReturnType<UserAvatar[]>;
						} = await axios.get(
							`${process.env.NEXT_PUBLIC_SERVER}/api/user/${userId}/avatar`,
						);
						const { data: avatar } = response.data;
						if (!avatar) {
							return [];
						}
						set({ userAvatars: avatar });
						return avatar;
					} catch (error) {
						console.error("Error in getUserAvatar:", error);
						return [];
					}
				},
				// Fetch connected repositories for the user
				getUserRepositories: async (userId: string): Promise<string[]> => {
					try {
						const response: { data: ApiReturnType<string[]> } = await axios.get(
							`${process.env.NEXT_PUBLIC_SERVER}/api/user/${userId}/repositories`,
						);

						const { data: repositories } = response.data;
						if (!repositories) {
							set({ connectedRepos: [] });
							return [];
						}

						set({ connectedRepos: repositories });
						return repositories;
					} catch (error) {
						console.error("Error fetching connected repositories:", error);
						set({ connectedRepos: [] });
						return [];
					}
				},
			}),
			{
				name: "user-store",
				storage: {
					getItem: (name) => {
						const storedValue = sessionStorage.getItem(name);
						return storedValue ? JSON.parse(storedValue) : null;
					},
					setItem: (name, value) => {
						sessionStorage.setItem(name, JSON.stringify(value));
					},
					removeItem: (name) => {
						sessionStorage.removeItem(name);
					},
				},
			},
		),
	);
};
