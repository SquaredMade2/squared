import { createStore } from "zustand/vanilla";
import type {
	ViewsStore,
	ViewsState,
	FilterResponse,
	SavedFilter,
	TaskFilter,
} from "./interfaces";
import { persist } from "zustand/middleware";
import { checkCondition } from "./helpers";
import type { SavedFilter as SavedFilterType } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
import axios from "axios";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/filter/${path}`;

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
				saveFilter: async (filter: SavedFilter): Promise<FilterResponse> => {
					try {
						const { data: response }: { data: ApiReturnType<SavedFilterType> } =
							await axios.post(apiString("create"), filter);
						const { data: filters } = response;

						if (!filter) {
							return {
								filter: null,
								message: "Failed to save filter",
								variant: "destructive",
							};
						}
						const parsedFilter = filter.filter as TaskFilter;

						const newFilter: SavedFilter = {
							id: filter.id,
							name: filter.name,
							workspaceId: filter.workspaceId,
							filter: {
								logic: parsedFilter.logic,
								conditions: parsedFilter.conditions.map((condition) => ({
									field: condition.field,
									value: condition.value,
									operator: condition.operator,
								})),
							},
						};
						set({ currentFilter: newFilter.filter });

						return {
							filter: newFilter,
							message: response.message,
							variant: response.variant,
						};
					} catch (error) {
						return {
							filter: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				updateSavedFilter: async (
					filterId: string,
					filter: Partial<SavedFilter>,
				): Promise<FilterResponse> => {
					try {
						const { data: response }: { data: ApiReturnType<SavedFilterType> } =
							await axios.put(apiString(filterId), filter);
						const { data: filters } = response;

						if (!filters) {
							return {
								filter: null,
								message: "Failed to update filter",
								variant: "destructive",
							};
						}
						const parsedFilter = filter.filter as TaskFilter;

						const newFilter: SavedFilter = {
							id: filters.id,
							name: filters.name,
							workspaceId: filters.workspaceId,
							filter: {
								logic: parsedFilter.logic,
								conditions: parsedFilter.conditions.map((condition) => ({
									field: condition.field,
									value: condition.value,
									operator: condition.operator,
								})),
							},
						};
						set({ currentFilter: newFilter.filter });

						return {
							filter: newFilter,
							message: response.message,
							variant: response.variant,
						};
					} catch (error) {
						return {
							filter: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				deleteSavedFilter: async (filterId) => {
					const response = await axios.delete(apiString(filterId));
					if (response.status === 200) {
						set({ currentFilter: null });
					}
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
