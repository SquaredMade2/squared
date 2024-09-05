import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { ViewsStore, ViewsState } from "./interfaces";
import { persist } from "zustand/middleware";
import { checkCondition } from "./helpers";

export const createViewsStore = (
	initState: ViewsState = {
		currentFilter: null,
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
				setCurrentFilter: (filter) => {
					set({ currentFilter: filter });
				},
				removeFilter: () => {
					set({ currentFilter: null });
				},
				addFilter: (filter) => {
					set((state) => {
						return {
							currentFilter: state.currentFilter
								? {
										logic: "AND",
										conditions: [...state.currentFilter.conditions, filter],
									}
								: {
										logic: "AND",
										conditions: [filter],
									},
						};
					});
				},
				filterTasks: (tasks, filter) => {
					return tasks.filter((task) => {
						return filter.logic === "AND"
							? filter.conditions.every((condition) =>
									checkCondition(task, condition),
								)
							: filter.conditions.some((condition) =>
									checkCondition(task, condition),
								);
					});
				},
				getCurrentFilter: () => {
					return initState.currentFilter;
				},
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
