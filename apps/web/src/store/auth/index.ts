import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { AuthReturn, AuthState, AuthStore, Login } from "./interfaces";
import type { User } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
import { signOut } from "next-auth/react";
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
					try {
						const response: { data: boolean } = await axios.post(
							apiString("logout"),
						);

						set({ user: null });

						// Clear all session storage items
						sessionStorage.clear();

						// Sign out using NextAuth and redirect to login page
						await signOut({ redirect: false });

						// Use Next.js router to redirect to login page
						window.location.href = "/login";

						return response.data;
					} catch (error) {
						console.error("Logout error:", error);
						return false;
					}
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
				checkTokenValid: async (token: string) => {
					const response: { data: AuthReturn } = await axios.post(
						apiString(token),
						{
							token,
							validate: true,
						},
					);
					set({ user: response.data.user });
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
