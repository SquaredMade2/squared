import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import {
	CompletedTaskPeriod,
	type DisplayOptions,
	type LastVisitedPathOption,
	type View,
	type ViewOptions,
	type ViewState,
	type ViewStore,
} from "./interfaces";

export type {
	CompletedTaskPeriod,
	DisplayOptions,
	DisplayProperty,
	LastVisitedPathOption,
	TaskGroup,
	TaskOrder,
	TaskOrderOptions,
	taskGroupOptions,
	View,
	ViewOptions,
	ViewPath,
	ViewState,
	ViewStore,
} from "./interfaces";
export { useViewStore, ViewStoreProvider } from "./store";

export const createViewStore = (
	initState: ViewState = {
		displayOptions: {
			groupRowsBy: "None",
			groupTasksBy: "Status",
			showCompletedTasks: { period: CompletedTaskPeriod.all, show: true },
			showSubTasks: false,
			taskOrder: { orderAscending: false, orderBy: "Priority" },
			viewOptions: {
				gridOptions: {
					displayProperties: {
						avatar: true,
						dueDate: true,
						identifier: true,
						labels: true,
						priority: true,
						status: true,
					},
					showEmptyGroups: false,
				},
				listOptions: {
					displayProperties: {
						avatar: true,
						dueDate: true,
						identifier: true,
						labels: true,
						priority: true,
						status: true,
					},
					showEmptyGroups: false,
				},
			},
		},
		lastVisitedPage: "all",
		showMobileNavbar: false,
		showNavbar: true,
		view: "grid",
	},
) => {
	return createStore<ViewStore>()(
		persist(
			(set, get) => ({
				...initState,
				getGridOptions: () => get().displayOptions.viewOptions.gridOptions,
				getListOptions: () => get().displayOptions.viewOptions.listOptions,
				setDisplayOptions: (input: Partial<DisplayOptions>) => {
					set(({ displayOptions }) => ({
						displayOptions: {
							...displayOptions,
							...input,
						},
					}));
				},
				setGroupRowsBy: (input: ViewState["displayOptions"]["groupRowsBy"]) =>
					set({
						displayOptions: { ...get().displayOptions, groupRowsBy: input },
					}),
				setLastVisitedPage: (input: LastVisitedPathOption) =>
					set({ lastVisitedPage: input }),
				setShowMobileNavbar: (input: boolean) =>
					set({ showMobileNavbar: input }),
				setShowNavbar: (input: boolean) => set({ showNavbar: input }),
				setView: (view: View) => set({ view }),
				setViewOptions: (input: ViewOptions.Common) => {
					set(({ displayOptions, view }) => ({
						displayOptions: {
							...displayOptions,
							viewOptions: {
								...displayOptions.viewOptions,
								[`${view}Options`]: {
									...displayOptions.viewOptions[`${view}Options`],
									...input,
								},
							},
						},
					}));
				},
			}),
			{
				name: "view-store",
				storage: {
					getItem: (name) => {
						const storedValue = localStorage.getItem(name);
						return storedValue ? JSON.parse(storedValue) : null;
					},
					removeItem: (name) => {
						localStorage.removeItem(name);
					},
					setItem: (name, value) => {
						localStorage.setItem(name, JSON.stringify(value));
					},
				},
			},
		),
	);
};
