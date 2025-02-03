import type { Task } from "@squared/db";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { checkCondition } from "./helpers";

import type {
	FilterCondition,
	FilterState,
	FilterStore,
	SavedFilter,
} from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createFilterStore = (
	initState: FilterState = {
		currentFilters: [],
		currentFilterTypes: [],
		savedFilters: [],
		showSaveForm: false,
		searchFilterValue: '',
	},
) => {
	return createStore<FilterStore>()(
		persist(
			(set, get) => ({
				...initState,
				setCurrentFilter: (filter): void => {
					set({ currentFilters: filter });
				},
				setSearchFilter: (input: string): void => {
					set({searchFilterValue: input})
				},
				filterSearchTasks: (tasks: Task[]): Task[] => {
					const filterValue = get().searchFilterValue;
					if (!filterValue) {
					  return tasks;
					}
		  
					return tasks.filter((task) =>
					  task.title.toLowerCase().includes(filterValue.toLowerCase()));
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
					savedFilterId: string,
				) => {
					const currentSavedFilter = get().savedFilters.find(
						(f) => f.id === savedFilterId,
					);
					const filterMap = new Map<string, FilterCondition>();
					//Add existing filter conditions to the map
					if (currentSavedFilter) {
						for (const condition of currentSavedFilter.filter) {
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
				saveFilter: (filter: SavedFilter): void =>
					set((state) => ({
						savedFilters: [...state.savedFilters, filter],
					})),
				setSavedFilters: (savedFilters): void => set({ savedFilters }),
				updateSavedFilter: (filter: SavedFilter): void => {
					set((state) => ({
						savedFilters: state.savedFilters.map((t) =>
							t.id === filter.id ? filter : t,
						),
					}));
				},
				deleteSavedFilter: (filterId) =>
					set((state) => ({
						savedFilters: state.savedFilters.filter((t) => t.id !== filterId),
					})),
			}),
			{
				name: "filter-store",
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
