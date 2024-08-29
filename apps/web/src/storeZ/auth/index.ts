import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { AuthReturn, AuthState, AuthStore, Login } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import type { User } from "@repo/db";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/auth/${path}`;

export const createTaskStore = (initState: AuthState = { user: null }) => {
	return createStore<AuthStore>()((set) => ({
		...initState,
		login: (userId: string, login: Login) => async () => {
			const response: AuthReturn = await axios.post(apiString(userId), login);
			set({ user: response.data.user });
			return response.data;
		},
		register: (login: Login) => async () => {
			const userId = uuidv4();
			const response: AuthReturn = await axios.post(apiString(userId), login);
			set({ user: response.data.user });
			return response.data;
		},
		verifyUser: (token: string) => async () => {
			const response: AuthReturn = await axios.post(apiString(""), {
				token,
			});
			set({ user: response.data.user });
			return response.data;
		},
		logout: () => async () => {
			const response: { data: boolean } = await axios.post(apiString("logout"));
			set({ user: null });
			return response.data;
		},
		resetPassword: (email: string) => async () => {
			const response: { data: boolean } = await axios.post(
				apiString("reset-password"),
				{
					email,
				},
			);
			return response.data;
		},
	}));
};
