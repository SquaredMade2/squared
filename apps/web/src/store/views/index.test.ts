import { createViewStore } from ".";
import type { ViewState, LastVisitedPathOption } from "./interfaces";

// Mock localStorage
const mockLocalStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
	value: mockLocalStorage,
});

describe("ViewStore", () => {
	let store: ReturnType<typeof createViewStore>;

	beforeEach(() => {
		store = createViewStore();
		jest.clearAllMocks();
	});

	it("should initialize with default values", () => {
		const state = store.getState();
		expect(state.showNavbar).toBe(true);
		expect(state.showMobileNavbar).toBe(false);
		expect(state.displayOptions).toEqual({
			taskOrder: { orderBy: "Priority", orderAscending: false },
			groupTasksBy: "Status",
			showCompletedTasks: { show: true, period: "All" },
			showSubTasks: false,
			viewOptions: {
				gridOptions: {
					showEmptyGroups: false,
					displayProperties: {
						identifier: true,
						dueDate: true,
						avatar: true,
						labels: true,
						status: true,
						priority: true,
					},
				},
				listOptions: {
					showEmptyGroups: false,
					displayProperties: {
						identifier: true,
						dueDate: true,
						avatar: true,
						labels: true,
						status: true,
						priority: true,
					},
				},
			},
		});
		expect(state.lastVisitedPage).toBe("all");
		expect(state.view).toBe("list");
	});

	describe("setView", () => {
		it("should update the view", () => {
			store.getState().setView("grid");
			expect(store.getState().view).toBe("grid");
		});
	});

	describe("getListOptions", () => {
		it("should return the list options", () => {
			const listOptions = store.getState().getListOptions();
			expect(listOptions).toEqual({
				showEmptyGroups: false,
				displayProperties: {
					identifier: true,
					dueDate: true,
					avatar: true,
					labels: true,
					status: true,
					priority: true,
				},
			});
		});
	});

	describe("getGridOptions", () => {
		it("should return the grid options", () => {
			const gridOptions = store.getState().getGridOptions();
			expect(gridOptions).toEqual({
				showEmptyGroups: false,
				displayProperties: {
					identifier: true,
					dueDate: true,
					avatar: true,
					labels: true,
					status: true,
					priority: true,
				},
			});
		});
	});

	describe("setShowNavbar", () => {
		it("should update the showNavbar state", () => {
			store.getState().setShowNavbar(false);
			expect(store.getState().showNavbar).toBe(false);
		});
	});

	describe("setShowMobileNavbar", () => {
		it("should update the showMobileNavbar state", () => {
			store.getState().setShowMobileNavbar(true);
			expect(store.getState().showMobileNavbar).toBe(true);
		});
	});

	describe("setListViewOptions", () => {
		it("should update the list view options", () => {
			const newOptions: Partial<ViewState["displayOptions"]> = {
				taskOrder: { orderBy: "Title", orderAscending: true },
				groupTasksBy: "Assignee",
			};
			store.getState().setListViewOptions(newOptions);
			const updatedState = store.getState().displayOptions;
			expect(updatedState.taskOrder).toEqual(newOptions.taskOrder);
			expect(updatedState.groupTasksBy).toBe(newOptions.groupTasksBy);
		});
	});

	describe("setGridViewOptions", () => {
		it("should update the grid view options", () => {
			const newOptions: Partial<ViewState["displayOptions"]> = {
				showCompletedTasks: { show: false, period: "Past week" },
				showSubTasks: true,
			};
			store.getState().setGridViewOptions(newOptions);
			const updatedState = store.getState().displayOptions;
			expect(updatedState.showCompletedTasks).toEqual(
				newOptions.showCompletedTasks,
			);
			expect(updatedState.showSubTasks).toBe(newOptions.showSubTasks);
		});
	});

	describe("setLastVisitedPage", () => {
		it("should update the last visited page", () => {
			const newPage: LastVisitedPathOption = "sprints/current";
			store.getState().setLastVisitedPage(newPage);
			expect(store.getState().lastVisitedPage).toBe(newPage);
		});
	});

	describe("persist middleware", () => {
		it("should hydrate the state from localStorage", () => {
			const mockState: ViewState = {
				showNavbar: false,
				showMobileNavbar: true,
				displayOptions: {
					taskOrder: { orderBy: "Due Date", orderAscending: true },
					groupTasksBy: "Priority",
					showCompletedTasks: { show: false, period: "Past month" },
					showSubTasks: true,
					viewOptions: {
						gridOptions: {
							showEmptyGroups: true,
							displayProperties: {
								identifier: false,
								dueDate: true,
								avatar: false,
								labels: true,
								status: true,
								priority: false,
							},
						},
						listOptions: {
							showEmptyGroups: true,
							displayProperties: {
								identifier: true,
								dueDate: false,
								avatar: true,
								labels: false,
								status: true,
								priority: true,
							},
						},
					},
				},
				lastVisitedPage: "backlog",
				view: "grid",
			};

			mockLocalStorage.getItem.mockReturnValue(
				JSON.stringify({ state: mockState }),
			);

			const newStore = createViewStore();
			const state = newStore.getState();

			// Check that the state properties match the mock state
			expect(state.showNavbar).toEqual(mockState.showNavbar);
			expect(state.showMobileNavbar).toEqual(mockState.showMobileNavbar);
			expect(state.displayOptions).toEqual(mockState.displayOptions);
			expect(state.lastVisitedPage).toEqual(mockState.lastVisitedPage);
			expect(state.view).toEqual(mockState.view);

			// Check that the methods exist
			expect(state.setView).toBeInstanceOf(Function);
			expect(state.getListOptions).toBeInstanceOf(Function);
			expect(state.getGridOptions).toBeInstanceOf(Function);
			expect(state.setShowNavbar).toBeInstanceOf(Function);
			expect(state.setShowMobileNavbar).toBeInstanceOf(Function);
			expect(state.setListViewOptions).toBeInstanceOf(Function);
			expect(state.setGridViewOptions).toBeInstanceOf(Function);
			expect(state.setLastVisitedPage).toBeInstanceOf(Function);
		});
	});
});
