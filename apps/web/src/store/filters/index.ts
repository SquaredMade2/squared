import { createStore } from "zustand/vanilla";
import type {
	FilterStore,
	FilterState,
	FilterResponse,
	SavedFilter,
	FilterCondition,
} from "./interfaces";
import { persist } from "zustand/middleware";
import { checkCondition } from "./helpers";
import type { SavedFilter as SavedFilterType } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
import axios from "axios";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/filter/${path}`;

export const createFilterStore = (
	initState: FilterState = {
		currentFilters: [],
	},
) => {
	return createStore<FilterStore>()(
		persist(
			(set, get) => ({
				...initState,
				setCurrentFilter: (filter) => {
					set({ currentFilters: filter });
				},
				clearFilter: () => {
					set({ currentFilters: [] });
				},
				addFilter: (filter: FilterCondition) => {
					const state = get();
					const currentFilters = state.currentFilters || [];

					const existingConditionIndex = currentFilters.findIndex(
						(condition) => condition.field === filter.field,
					);

					let updatedConditions: FilterCondition[];

					if (existingConditionIndex !== -1) {
						// Update existing condition
						updatedConditions = currentFilters.map((condition, index) =>
							index === existingConditionIndex
								? {
										...condition,
										value: filter.value,
										operator: filter.operator,
									}
								: condition,
						);
					} else {
						// Add new condition
						updatedConditions = [...currentFilters, filter];
					}

					set({ currentFilters: updatedConditions });

					return updatedConditions;
				},
				removeFilter: (field: string) => {
					const state = get();
					const updatedConditions =
						state.currentFilters.filter(
							(condition) => condition.field !== field,
						) || [];
					set({
						currentFilters: updatedConditions,
					});
				},
				filterTasks: (tasks) => {
					const state = get();
					const currentFilters = state.currentFilters;

					if (!currentFilters || currentFilters.length === 0) {
						return tasks;
					}

					return tasks.filter((task) => {
						const matchesAll = currentFilters.every((condition) => {
							const result = checkCondition(task, condition);

							return result;
						});

						return matchesAll;
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
						const parsedFilter = filter.filter;

						const newFilter: SavedFilter = {
							id: filter.id,
							name: filter.name,
							workspaceId: filter.workspaceId,
							filter: parsedFilter.map((condition) => ({
								field: condition.field,
								value: condition.value,
								operator: condition.operator,
							})),
						};
						set({ currentFilters: newFilter.filter });

						return {
							filter: newFilter.filter,
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
						const parsedFilter = filters.filter as FilterCondition[];
						const newFilter: SavedFilter = {
							id: filters.id,
							name: filters.name,
							workspaceId: filters.workspaceId,
							filter: parsedFilter.map((condition) => ({
								field: condition.field,
								value: condition.value,
								operator: condition.operator,
							})),
						};
						set({ currentFilters: newFilter.filter });

						return {
							filter: newFilter.filter,
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
						set({ currentFilters: [] });
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
