import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { ViewsStore, ViewsState } from "./interfaces";
import { persist } from "zustand/middleware";

export const createViewsStore = (
	initState: ViewsState = {
		currentFilter: null,
		showDateTime: true,
		showPriority: true,
		showLabels: true,
	},
) => {
	return createStore<ViewsStore>()(
		persist(
			(set) => ({
				...initState,
				setCurrentFilter: (filter) => () => {
					set({ currentFilter: filter });
				},
				updateCurrentFilter: (filter) => (state) => {
					set({ currentFilter: { ...state.currentFilter, ...filter } });
				},
				removeFilter: () => () => {
					set({ currentFilter: null });
				},
				getCurrentFilter: () => {
					return initState.currentFilter;
				},
				setShowDateTime: (input) => () => {
					set({ showDateTime: input });
				},
				setShowPriority: (input) => () => {
					set({ showPriority: input });
				},
				setShowLabels: (input) => () => {
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
