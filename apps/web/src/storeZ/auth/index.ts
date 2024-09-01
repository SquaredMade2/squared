import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { AuthReturn, AuthState, AuthStore, Login } from "./interfaces";
import { useAuthStore } from "../provider";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/auth/${path}`;

export const createAuthStore = (initState: AuthState = { user: null }) => {
	return createStore<AuthStore>()(
		persist(
			(set) => ({
				...initState,
				login: async (login: Login) => {
					const response: AuthReturn = await axios.post(apiString(""), login);
					set({ user: response.data.user });
					return response.data;
				},
				register: async (login: Login) => {
					const response: AuthReturn = await axios.post(apiString(""), login);
					set({ user: response.data.user });
					return response.data;
				},
				verifyUser: async (token: string) => {
					const response: AuthReturn = await axios.post(apiString(token), {
						token,
					});
					set({ user: response.data.user });
					return response.data;
				},
				logout: async () => {
					const response: { data: boolean } = await axios.post(
						apiString("logout"),
					);
					set({ user: null });
					sessionStorage.removeItem("auth-store");
					sessionStorage.removeItem("activity-store");
					sessionStorage.removeItem("task-store");
					sessionStorage.removeItem("notification-store");
					sessionStorage.removeItem("team-store");
					sessionStorage.removeItem("workspace-store");
					sessionStorage.removeItem("user-store");
					sessionStorage.removeItem("view-store");
					return response.data;
				},
				resetPassword: async (email: string) => {
					const response: { data: boolean } = await axios.post(
						apiString("reset-password"),
						{
							email,
						},
					);
					return response.data;
				},
			}),
			{
				name: "auth-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
