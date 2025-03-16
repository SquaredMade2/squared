import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import {
	CompletedTaskPeriod,
	type LastVisitedPathOption,
	type View,
	type ViewState,
	type ViewStore,
} from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createViewStore = (
	initState: ViewState = {
		showNavbar: true,
		showMobileNavbar: false,
		displayOptions: {
			taskOrder: { orderBy: "Priority", orderAscending: false },
			groupTasksBy: "Status",
			groupRowsBy: "None",
			showCompletedTasks: { show: true, period: CompletedTaskPeriod.all },
			showSubTasks: false,
			viewOptions: {
				gridOptions: {
					showEmptyGroups: false,
					displayProperties: {
						identifier: true,
						dueDate: true,
						avatar: true,
						labels: true,
						status: true,
						priority: true,
					},
				},
				listOptions: {
					showEmptyGroups: false,
					displayProperties: {
						identifier: true,
						dueDate: true,
						avatar: true,
						labels: true,
						status: true,
						priority: true,
					},
				},
			},
		},
		lastVisitedPage: "all",
		view: "grid",
	},
) => {
	return createStore<ViewStore>()(
		persist(
			(set, get) => ({
				...initState,
				setView: (view: View) => set({ view }),
				getListOptions: () => get().displayOptions.viewOptions.listOptions,
				getGridOptions: () => get().displayOptions.viewOptions.gridOptions,
				setShowNavbar: (input: boolean) => set({ showNavbar: input }),
				setShowMobileNavbar: (input: boolean) =>
					set({ showMobileNavbar: input }),
				setListViewOptions: (input: Partial<ViewState["displayOptions"]>) => {
					const { displayOptions } = get();
					set({ displayOptions: { ...displayOptions, ...input } });
				},
				setGridViewOptions: (input: Partial<ViewState["displayOptions"]>) => {
					const { displayOptions } = get();
					set({ displayOptions: { ...displayOptions, ...input } });
				},
				setLastVisitedPage: (input: LastVisitedPathOption) =>
					set({ lastVisitedPage: input }),
				setGroupRowsBy: (input: ViewState["displayOptions"]["groupRowsBy"]) =>
					set({
						displayOptions: { ...get().displayOptions, groupRowsBy: input },
					}),
			}),
			{
				name: "view-store",
				storage: {
					getItem: (name) => {
						const storedValue = localStorage.getItem(name);
						return storedValue ? JSON.parse(storedValue) : null;
					},
					setItem: (name, value) => {
						localStorage.setItem(name, JSON.stringify(value));
					},
					removeItem: (name) => {
						localStorage.removeItem(name);
					},
				},
			},
		),
	);
};
