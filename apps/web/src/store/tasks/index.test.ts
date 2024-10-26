import { createTaskStore } from ".";
import axios from "axios";
import type { Task } from "@repo/db";
import { STANDARD_SPRINT, STANDARD_TASK } from "@/test/mocks";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock uuid
jest.mock("uuid", () => ({
	v4: jest.fn(() => "mocked-uuid"),
}));

// Mock sessionStorage
const mockSessionStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
	value: mockSessionStorage,
});

describe("TaskStore", () => {
	let store: ReturnType<typeof createTaskStore>;

	beforeEach(() => {
		store = createTaskStore();
		jest.clearAllMocks();
	});

	it("should initialize with an empty tasks array and null currentTask", () => {
		const state = store.getState();
		expect(state.tasks).toEqual([]);
		expect(state.currentTask).toBeNull();
	});

	describe("addTask", () => {
		it("should add a task and update the state", async () => {
			const mockTask: Partial<Task> = {
				title: "Test Task",
				status: "todo",
			};

			const mockResponse = {
				data: {
					data: { id: "mocked-uuid", ...mockTask } as Task,
					message: "Task added successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().addTask(mockTask);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining("/api/task/mocked-uuid"),
				mockTask,
			);

			expect(result).toEqual({
				task: mockResponse.data.data,
				message: "Task added successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.tasks).toHaveLength(1);
			expect(state.tasks[0]).toEqual(mockResponse.data.data);
		});
	});

	describe("updateTask", () => {
		it("should update a task and update the state", async () => {
			store.setState({ tasks: [STANDARD_TASK] });

			const updatedTask: Partial<Task> = {
				title: "Updated Task",
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_TASK, ...updatedTask },
					message: "Task updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.updateTask(STANDARD_TASK.id, updatedTask);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(`/api/task/${STANDARD_TASK.id}`),
				updatedTask,
			);

			expect(result).toEqual({
				task: mockResponse.data.data,
				message: "Task updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.tasks).toHaveLength(1);
			expect(state.tasks[0].title).toBe("Updated Task");
		});
	});

	describe("deleteTask", () => {
		it("should delete a task and update the state", async () => {
			store.setState({ tasks: [STANDARD_TASK] });

			mockedAxios.delete.mockResolvedValue({});

			await store.getState().deleteTask(STANDARD_TASK.id);

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				expect.stringContaining(`/api/task/${STANDARD_TASK.id}`),
			);

			const state = store.getState();
			expect(state.tasks).toHaveLength(0);
		});
	});

	describe("getTask", () => {
		it("should return an existing task from the state", async () => {
			store.setState({ tasks: [STANDARD_TASK] });

			const result = await store.getState().getTask(STANDARD_TASK.id);

			expect(result).toEqual({
				task: STANDARD_TASK,
				message: "Task found",
				variant: "default",
			});

			expect(mockedAxios.get).not.toHaveBeenCalled();
		});

		it("should fetch a task from the API if not in state", async () => {
			const mockResponse = {
				data: {
					data: STANDARD_TASK,
					message: "Task fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getTask(STANDARD_TASK.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/task/${STANDARD_TASK.id}`),
			);

			expect(result).toEqual({
				task: STANDARD_TASK,
				message: "Task fetched successfully",
				variant: "default",
			});
		});
	});

	describe("getAllTasks", () => {
		it("should fetch all tasks for a team and update the state", async () => {
			const mockTasks = [STANDARD_TASK, { ...STANDARD_TASK, id: "task-2" }];

			const mockResponse = {
				data: {
					data: mockTasks,
					message: "Tasks fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getAllTasks("team-1");

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining("/api/team/team-1/task"),
			);

			expect(result).toEqual(mockTasks);

			const state = store.getState();
			expect(state.tasks).toEqual(mockTasks);
		});
	});

	describe("toggleSprintTasks", () => {
		it("should toggle sprint tasks and update the state", async () => {
			const initialTasks = [
				STANDARD_TASK,
				{ ...STANDARD_TASK, id: "task-2", sprintId: null },
			];
			store.setState({ tasks: initialTasks });

			const updatedTasks = [
				{ ...STANDARD_TASK, sprintId: STANDARD_SPRINT.id },
				{ ...STANDARD_TASK, id: "task-2", sprintId: STANDARD_SPRINT.id },
			];

			const mockResponse = {
				data: {
					data: updatedTasks,
					message: "Sprint tasks updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.toggleSprintTasks("team-1", STANDARD_SPRINT.id, "add");

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/team/team-1/sprints/${STANDARD_SPRINT.id}/tasks`,
				),
				{ type: "add" },
			);

			expect(result).toEqual({
				data: updatedTasks,
				message: "Sprint tasks updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.tasks).toEqual(updatedTasks);
		});
	});

	describe("persist middleware", () => {
		it("should hydrate the state from sessionStorage", () => {
			const mockState = {
				tasks: [STANDARD_TASK],
				currentTask: null,
			};
			mockSessionStorage.getItem.mockReturnValue(
				JSON.stringify({ state: mockState }),
			);

			const newStore = createTaskStore();
			const state = newStore.getState();

			expect(state.tasks).toEqualWithDatePrecision([STANDARD_TASK]);
			expect(state.currentTask).toBeNull();
		});
	});
});
