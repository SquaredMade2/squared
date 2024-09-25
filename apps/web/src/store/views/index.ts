import { createStore } from "zustand/vanilla";
import type { ViewStore, ViewState } from "./interfaces";
import { persist } from "zustand/middleware";
export * from "./interfaces";
export * from "./store";

export const createViewStore = (
	initState: ViewState = {
		showDateTime: true,
		showPriority: true,
		showLabels: true,
		showNavbar: false,
		showMobileNavbar: false,
		listViewOptions: { showEmptyGroups: false },
		gridViewOptions: { showEmptyGroups: false },
		view: "list",
	},
) => {
	return createStore<ViewStore>()(
		persist(
			(set) => ({
				...initState,
				setView: (view) => {
					set({ view });
				},
				setShowNavbar: (input) => {
					set({ showNavbar: input });
				},
				setShowMobileNavbar: (input) => {
					set({ showMobileNavbar: input });
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
				setListViewOptions: (input) => {
					set({ listViewOptions: { showEmptyGroups: input } });
				},
				setGridViewOptions: (input) => {
					set({ gridViewOptions: { showEmptyGroups: input } });
				},
			}),
			{
				name: "view-store",
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
