import { createStore } from "zustand/vanilla";
import type {
	FilterStore,
	FilterState,
	FilterResponse,
	SavedFilter,
	FilterCondition,
} from "./interfaces";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { checkCondition, parseFilter } from "./helpers";
import type { SavedFilter as SavedFilterType, Task } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
import axios from "axios";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/filter/${path}`;

export const createFilterStore = (
	initState: FilterState = {
		currentFilters: [],
		currentFilterTypes: [],
		savedFilters: [],
		showSaveForm: false,
	},
) => {
	return createStore<FilterStore>()(
		persist(
			(set, get) => ({
				...initState,
				setCurrentFilter: (filter): void => {
					set({ currentFilters: filter });
				},
				setShowSaveForm: (input): void => {
					set({ showSaveForm: input });
				},
				clearFilter: (): void => {
					set({ currentFilters: [], currentFilterTypes: [] });
				},
				addFilter: (filter: FilterCondition): void => {
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

					set({
						currentFilters: updatedConditions,
						currentFilterTypes: [...state.currentFilterTypes, filter.field],
					});
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
				filterTasks: (tasks): Task[] => {
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
				customFilter: (tasks, filters): Task[] => {
					if (!filters || filters.length === 0) {
						return tasks;
					}

					return tasks.filter((task) => {
						const matchesAll = filters.every((condition) => {
							const result = checkCondition(task, condition);

							return result;
						});

						return matchesAll;
					});
				},
				mergeFilters: (
					newFilters: FilterCondition[],
					savedFilters: FilterCondition[],
				) => {
					const filterMap = new Map<string, FilterCondition>();
					//Add existing filter conditions to the map
					if (savedFilters) {
						for (const condition of savedFilters) {
							filterMap.set(condition.field as string, condition);
						}
					}
					//Merge new filter conditions, replacing any existing fields
					for (const condition of newFilters) {
						filterMap.set(condition.field as string, condition);
					}
					//Convert the map back into an array of FilterCondition
					return Array.from(filterMap.values());
				},
				saveFilter: async (
					filter: Partial<SavedFilter>,
				): Promise<FilterResponse> => {
					try {
						const filterId = uuidv4();
						const { data: response }: { data: ApiReturnType<SavedFilterType> } =
							await axios.post(apiString(filterId), filter);

						const { data: newFilter } = response;
						if (!newFilter) {
							return {
								filter: null,
								message: "Failed to save filter",
								variant: "destructive",
							};
						}
						const parsedFilter = parseFilter(newFilter);
						const currentSavedFilters = get().savedFilters;

						set({ savedFilters: [...currentSavedFilters, parsedFilter] });

						return {
							filter: parsedFilter?.filter || null,
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
				getSavedFilters: async (groupId: string): Promise<SavedFilter[]> => {
					try {
						const {
							data: response,
						}: { data: ApiReturnType<SavedFilterType[]> } = await axios.get(
							apiString(groupId),
						);
						const { data: filters } = response;
						if (!filters) {
							return [];
						}
						const parsedFilters = filters.map(parseFilter);
						set({ savedFilters: parsedFilters });

						return parsedFilters;
					} catch {
						console.error("Error fetching saved filters");
						return [];
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
						const parsedFilter = parseFilter(filters);
						const currentSavedFilters = get().savedFilters;
						set({
							savedFilters: currentSavedFilters.map((f) =>
								f.id === filterId ? parsedFilter : f,
							),
						});

						return {
							filter: parsedFilter.filter,
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
				deleteSavedFilter: async (filterId): Promise<void> => {
					const response = await axios.delete(apiString(filterId));
					if (response.status === 200) {
						set({ currentFilters: [] });
					}
				},
			}),
			{
				name: "filter-store",
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
