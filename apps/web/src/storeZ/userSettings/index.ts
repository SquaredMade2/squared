import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import type { UserSettingsState, UserSettingsStore } from "./interfaces";
export * from "./interfaces";

export const createUserSettingsStore = (
	initState: UserSettingsState = { showNavBar: false },
) => {
	return createStore<UserSettingsStore>()(
		persist(
			(set) => ({
				...initState,
				navBarToggle: () => {
					set((state: UserSettingsState) => ({
						showNavBar: !state.showNavBar,
					}));
				},
			}),
			{
				name: "user-settings-store",
				getStorage: () => sessionStorage, // You can change this to localStorage if needed
			},
		),
	);
};
