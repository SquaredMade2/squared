import { createStore } from "zustand/vanilla";
import type { ViewStore, ViewState } from "./interfaces";
import { persist } from "zustand/middleware";
export * from "./interfaces";
export * from "./store";

export const createViewStore = (
	initState: ViewState = {
		showNavbar: true,
		showMobileNavbar: false,
		listViewOptions: {
			showEmptyGroups: false,
			showCompletedTasks: { show: true, period: "All" },
			displayProperties: {
				identifier: true,
				dueDate: true,
				avatar: true,
				labels: true,
				status: true,
				priority: true,
			},
		},
		gridViewOptions: {
			showEmptyGroups: false,
			showCompletedTasks: { show: true, period: "All" },
			displayProperties: {
				identifier: true,
				dueDate: true,
				avatar: true,
				labels: true,
				status: true,
				priority: true,
			},
		},
		view: "list",
	},
) => {
	return createStore<ViewStore>()(
		persist(
			(set, get) => ({
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
				setListViewOptions: (input) => {
					const currentListView = get().listViewOptions;
					set({ listViewOptions: { ...currentListView, ...input } });
				},
				setGridViewOptions: (input) => {
					const currentGridView = get().gridViewOptions;
					set({ gridViewOptions: { ...currentGridView, ...input } });
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
