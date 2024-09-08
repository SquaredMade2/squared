import { createStore } from "zustand/vanilla";
import type {
	FilterStore,
	FilterState,
	FilterCondition,
	TaskFilter,
	FilterResponse,
} from "./interfaces";
import { persist } from "zustand/middleware";
import { checkCondition } from "./helpers";
import type { ApiReturnType } from "../interfaces";
import type { Filter } from "@repo/db";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/filter/${path}`;

export const createFiltersStore = (
	initState: FilterState = {
		currentFilter: null,
		savedFilters: [],
	},
) => {
	return createStore<FilterStore>()(
		persist(
			(set, get) => ({
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
				saveFilter: async (userId: string, filter: TaskFilter) => {
					try {
						const { id, ...filterData } = filter;
						const response = await axios.post(apiString(id ? `${id}` : ""), {
							...filterData,
							userId,
						});
						set({
							savedFilters: id
								? get().savedFilters.map((f) =>
										f.id === id ? response.data.data : f,
									)
								: [...get().savedFilters, response.data.data],
						});
						return response.data;
					} catch (error) {
						console.error("Error saving filter:", error);
						return {
							filter: null,
							message: "Failed to save filter",
							variant: "destructive",
						};
					}
				},
				deleteFilter: async (filterId: string) => {
					try {
						const { savedFilters } = get();
						set({
							savedFilters: savedFilters.filter(
								(filter) => filter.id !== filterId,
							),
						});
						await axios.delete(apiString(`${filterId}`));
					} catch (error) {
						console.error("Error deleting filter:", error);
						return {
							filter: null,
							message: "Failed to delete filter",
							variant: "destructive",
						};
					}
				},
				getSavedFilters: async (userId: string) => {
					try {
						const response = await axios.get(
							`${process.env.NEXT_PUBLIC_SERVERZ}/api/user/${userId}/filter`,
						);
						set({ savedFilters: response.data.data });
						return response.data.data || [];
					} catch (error) {
						console.error("Error fetching saved filters:", error);
						return [];
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
