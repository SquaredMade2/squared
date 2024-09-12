import { createStore } from "zustand/vanilla";
import type {
	FilterStore,
	FilterState,
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

export const createFilterStore = (
	initState: FilterState = {
		currentFilter: null,
		filters: [],
	},
) => {
	return createStore<FilterStore>()(
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
						let match = filter.logic === "AND";

						for (const condition of filter.conditions) {
							if (filter.logic === "AND") {
								// If any condition fails, return false (for AND logic)
								if (!checkCondition(task, condition)) {
									match = false;
									break;
								}
							} else if (filter.logic === "OR") {
								// If any condition passes, return true (for OR logic)
								if (checkCondition(task, condition)) {
									match = true;
									break;
								}
							}
						}

						return match;
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
			}),
			{
				name: "filter-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
