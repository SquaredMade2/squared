import { createStore } from "zustand/vanilla";
import type { ViewsStore, ViewsState } from "./interfaces";
import { persist } from "zustand/middleware";
export * from "./interfaces";
export * from "./store";

export const createViewsStore = (
	initState: ViewsState = {
		showDateTime: true,
		showPriority: true,
		showLabels: true,
		showNavbar: true,
		view: "list",
	},
) => {
	return createStore<ViewsStore>()(
		persist(
			(set) => ({
				...initState,
				setView: (view) => {
					set({ view });
				},
				setShowNavbar: (input) => {
					set({ showNavbar: input });
				},
				setShowDateTime: (input) => {
					set({ showDateTime: input });
				},
				setShowPriority: (input) => {
					set({ showPriority: input });
				},
				setShowLabels: (input) => {
					set({ showLabels: input });
				},
			}),
			{
				name: "view-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
