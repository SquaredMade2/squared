import { STANDARD_TASK, STANDARD_TASK_2 } from "@/test/mocks";
import type { Task } from "@squared/db";
import { createFilterStore } from ".";
import type { FilterCondition, SavedFilter } from "./interfaces";

// Mock uuid
jest.mock("uuid", () => ({
	v4: jest.fn(() => "mocked-uuid"),
}));

describe("FilterStore", () => {
	let store: ReturnType<typeof createFilterStore>;
	const mockTasks: Task[] = [STANDARD_TASK, STANDARD_TASK_2];
	beforeEach(() => {
		store = createFilterStore();
		jest.clearAllMocks();
	});

	it("should initialize with empty filters", () => {
		const state = store.getState();
		expect(state.currentFilters).toEqual([]);
		expect(state.currentFilterTypes).toEqual([]);
		expect(state.savedFilters).toEqual([]);
		expect(state.showSaveForm).toBe(false);
	});

	describe("setCurrentFilter", () => {
		it("should set the current filter", () => {
			const filter: FilterCondition[] = [
				{ field: "status", value: "In Progress", operator: "equals" },
			];
			store.getState().setCurrentFilter(filter);
			expect(store.getState().currentFilters).toEqual(filter);
		});
	});

	describe("setShowSaveForm", () => {
		it("should set the showSaveForm state", () => {
			store.getState().setShowSaveForm(true);
			expect(store.getState().showSaveForm).toBe(true);
		});
	});

	describe("clearFilter", () => {
		it("should clear all filters", () => {
			store.setState({
				currentFilters: [
					{ field: "status", value: "In Progress", operator: "equals" },
				],
				currentFilterTypes: ["status"],
			});
			store.getState().clearFilter();
			expect(store.getState().currentFilters).toEqual([]);
			expect(store.getState().currentFilterTypes).toEqual([]);
		});
	});

	describe("addFilter", () => {
		it("should add a new filter", () => {
			const filter: FilterCondition = {
				field: "status",
				value: "In Progress",
				operator: "equals",
			};
			store.getState().addFilter(filter);
			expect(store.getState().currentFilters).toContainEqual(filter);
			expect(store.getState().currentFilterTypes).toContain("status");
		});

		it("should update an existing filter", () => {
			const initialFilter: FilterCondition = {
				field: "status",
				value: "In Progress",
				operator: "equals",
			};
			const updatedFilter: FilterCondition = {
				field: "status",
				value: "Completed",
				operator: "equals",
			};
			store.getState().addFilter(initialFilter);
			store.getState().addFilter(updatedFilter);
			expect(store.getState().currentFilters).toContainEqual(updatedFilter);
			expect(store.getState().currentFilters).toHaveLength(1);
		});
	});

	describe("removeFilter", () => {
		it("should remove a filter", () => {
			const filter: FilterCondition = {
				field: "status",
				value: "In Progress",
				operator: "equals",
			};
			store.getState().addFilter(filter);
			store.getState().removeFilter("status");
			expect(store.getState().currentFilters).toEqual([]);
		});
	});

	describe("filterTasks", () => {
		it("should filter tasks based on current filters", () => {
			store.getState().addFilter({
				field: "status",
				value: "inProgress",
				operator: "equals",
			});
			const filteredTasks = store.getState().filterTasks(mockTasks);
			expect(filteredTasks).toHaveLength(1);
			expect(filteredTasks[0].id).toBe(STANDARD_TASK_2.id);
		});
	});

	describe("customFilter", () => {
		it("should filter tasks based on provided filters", () => {
			const filters: FilterCondition[] = [
				{ field: "status", value: "inProgress", operator: "equals" },
			];
			const filteredTasks = store.getState().customFilter(mockTasks, filters);
			expect(filteredTasks).toHaveLength(1);
			expect(filteredTasks[0].id).toBe(STANDARD_TASK_2.id);
		});
	});

	describe("mergeFilters", () => {
		it("should merge new filters with existing saved filter", () => {
			const savedFilter: SavedFilter = {
				id: "saved-1",
				name: "Saved Filter",
				filter: [{ field: "status", value: "In Progress", operator: "equals" }],
				authorId: "author-1",
				description: null,
				teamId: "team-1",
				workspaceId: "workspace-1",
				type: "WORKSPACE",
			};
			store.setState({ savedFilters: [savedFilter] });
			const newFilters: FilterCondition[] = [
				{ field: "priority", value: "High", operator: "equals" },
			];
			const mergedFilters = store
				.getState()
				.mergeFilters(newFilters, "saved-1");
			expect(mergedFilters).toHaveLength(2);
			expect(mergedFilters).toContainEqual({
				field: "status",
				value: "In Progress",
				operator: "equals",
			});
			expect(mergedFilters).toContainEqual({
				field: "priority",
				value: "High",
				operator: "equals",
			});
		});
	});
});
