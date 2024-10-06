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
			taskOrder: { orderBy: "Priority", orderAscending: true },
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
			taskOrder: { orderBy: "Priority", orderAscending: true },
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
		lastVisitedPage: "All",
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
				setLastVisitedPage: (input) => {
					set({ lastVisitedPage: input });
				},
			}),
			{
				name: "view-store",
				storage: {
					getItem: (name) => {
						const storedValue = sessionStorage.getItem(name);
						const lastVisitedPage = localStorage.getItem("lastVisitedPage");

						if (storedValue) {
							const parsedValue = JSON.parse(storedValue);
							return { ...parsedValue, lastVisitedPage };
						}

						return { lastVisitedPage };
					},
					setItem: (name, value) => {
						if (typeof value === "string") {
							const parsedValue = JSON.parse(value);

							const { lastVisitedPage, ...rest } = parsedValue;

							if (lastVisitedPage) {
								localStorage.setItem(
									"lastVisitedPage",
									JSON.stringify(lastVisitedPage),
								);
							}
							sessionStorage.setItem(name, JSON.stringify(rest));
						}
					},
					removeItem: (name) => {
						sessionStorage.removeItem(name);
						localStorage.removeItem("lastVisitedPage");
					},
				},
			},
		),
	);
};
