import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { AuthReturn, AuthState, AuthStore, Login } from "./interfaces";
import { destroyCookie } from "nookies";
import type { User } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/auth/${path}`;

export const createAuthStore = (initState: AuthState = { user: null }) => {
	return createStore<AuthStore>()(
		persist(
			(set) => ({
				...initState,
				login: async (login: Login) => {
					const { data: response }: { data: ApiReturnType<User> } =
						await axios.post(apiString(""), login);
					const { data: user, message, variant } = response;
					set({ user });
					return {
						user,
						message,
						variant,
					};
				},
				register: async (login: Login) => {
					const response: { data: AuthReturn } = await axios.post(
						apiString(""),
						login,
					);
					set({ user: response.data.user });
					return response.data;
				},
				verifyUser: async (token: string) => {
					const response: { data: AuthReturn } = await axios.post(
						apiString(token),
						{
							token,
						},
					);
					set({ user: response.data.user });
					return response.data;
				},
				logout: async () => {
					const response: { data: boolean } = await axios.post(
						apiString("logout"),
					);
					set({ user: null });
					destroyCookie(undefined, "auth-store");
					sessionStorage.removeItem("auth-store");
					sessionStorage.removeItem("activity-store");
					sessionStorage.removeItem("task-store");
					sessionStorage.removeItem("notification-store");
					sessionStorage.removeItem("team-store");
					sessionStorage.removeItem("workspace-store");
					sessionStorage.removeItem("user-store");
					sessionStorage.removeItem("view-store");
					sessionStorage.removeItem("filter-store");
					return response.data;
				},
				resetPasswordEmail: async (email: string) => {
					const response: { data: AuthReturn } = await axios.post(
						apiString("reset-password"),
						{
							email,
						},
					);
					return response.data;
				},
				resetPassword: async (token: string, newPassword: string) => {
					const response: { data: AuthReturn } = await axios.post(
						apiString(`reset-password/${token}`),
						{
							newPassword,
						},
					);
					return response.data;
				},
				setUser: (user: User | null) => {
					set({ user });
				},
			}),
			{
				name: "auth-store",
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
