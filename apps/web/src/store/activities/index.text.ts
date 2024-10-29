// import { createActivityStore } from ".";
// import axios from "axios";
// import type { Prisma } from "@squared/db";
// import { STANDARD_COMMIT, STANDARD_TASK_EVENT } from "@/test/mocks";

// // Mock axios
// jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// // Define types based on the Prisma schema
// type ActivityType = Prisma.ActivityGetPayload<{
// 	include: { taskEvent: true; commit: true };
// }>;

// describe("ActivityStore", () => {
// 	let store: ReturnType<typeof createActivityStore>;

// 	beforeEach(() => {
// 		store = createActivityStore();
// 		jest.clearAllMocks();
// 		window.sessionStorage.getItem.mockClear();
// 		window.sessionStorage.setItem.mockClear();
// 	});

// 	it("should initialize with an empty events array", () => {
// 		const state = store.getState();
// 		expect(state.events).toEqual([]);
// 	});

// 	describe("addTaskEvent", () => {
// 		it("should add a task event and update the state", async () => {
// 			const mockResponse: { data: ActivityType } = {
// 				data: {
// 					id: "activity1",
// 					createdAt: new Date(),
// 					type: "TASK_EVENT",
// 					eventLogId: "eventLog1",
// 					taskEvent: STANDARD_TASK_EVENT,
// 					commit: null,
// 				},
// 			};

// 			mockedAxios.post.mockResolvedValue(mockResponse);

// 			const result = await store
// 				.getState()
// 				.addTaskEvent(STANDARD_TASK_EVENT, "task1", "author1");

// 			expect(mockedAxios.post).toHaveBeenCalledWith(
// 				expect.stringContaining("/api/activity/task1"),
// 				{ ...STANDARD_TASK_EVENT, type: "TASK_EVENT", authorId: "author1" },
// 			);

// 			expect(result).toEqual(STANDARD_TASK_EVENT);

// 			const state = store.getState();
// 			expect(state.events).toHaveLength(1);
// 			expect(state.events[0]).toEqual(mockResponse.data);
// 		});
// 	});

// 	describe("addCommitEvent", () => {
// 		it("should add a commit event and update the state", async () => {
// 			const mockResponse: { data: ActivityType } = {
// 				data: {
// 					id: "activity1",
// 					createdAt: new Date(),
// 					type: "COMMIT",
// 					eventLogId: "eventLog1",
// 					taskEvent: null,
// 					commit: STANDARD_COMMIT,
// 				},
// 			};

// 			mockedAxios.post.mockResolvedValue(mockResponse);

// 			const result = await store
// 				.getState()
// 				.addCommitEvent(STANDARD_COMMIT, "task1", "author1");

// 			expect(mockedAxios.post).toHaveBeenCalledWith(
// 				expect.stringContaining("/api/activity/task1"),
// 				{ event: STANDARD_COMMIT, type: "COMMIT", authorId: "author1" },
// 			);

// 			expect(result).toEqual(STANDARD_COMMIT);

// 			const state = store.getState();
// 			expect(state.events).toHaveLength(1);
// 			expect(state.events[0]).toEqual(mockResponse.data);
// 		});
// 	});

// 	describe("getTaskEvents", () => {
// 		it("should fetch task events and update the state", async () => {
// 			const mockEvents: ActivityType[] = [
// 				{
// 					id: "activity1",
// 					createdAt: new Date(),
// 					type: "TASK_EVENT",
// 					eventLogId: "eventLog1",
// 					taskEvent: {
// 						id: "1",
// 						type: "CREATED",
// 						authorId: "author1",
// 						authorName: "Author Name",
// 						activityId: "activity1",
// 						createdAt: new Date(),
// 						taskId: "task1",
// 						originalValue: null,
// 						updatedValue: null,
// 						originalAssigneeId: null,
// 						originalAssigneeName: null,
// 						updatedAssigneeId: null,
// 						updatedAssigneeName: null,
// 						gitUpdated: null,
// 						originalLabels: [],
// 						updatedLabels: [],
// 					},
// 					commit: null,
// 				},
// 				{
// 					id: "activity2",
// 					createdAt: new Date(),
// 					type: "COMMIT",
// 					eventLogId: "eventLog1",
// 					taskEvent: null,
// 					commit: {
// 						id: "1",
// 						treeId: "tree1",
// 						distinct: true,
// 						message: "Initial commit",
// 						timestamp: "2023-06-01T12:00:00Z",
// 						url: "https://github.com/repo/commit/1",
// 						authorName: "Author Name",
// 						authorEmail: "author@example.com",
// 						authorUsername: "authoruser",
// 						committerName: "Committer Name",
// 						committerEmail: "committer@example.com",
// 						committerUsername: "committeruser",
// 						added: ["file1.txt"],
// 						removed: [],
// 						modified: [],
// 						repoName: "repo",
// 						owner: "owner",
// 						activityId: "activity2",
// 					},
// 				},
// 			];

// 			mockedAxios.get.mockResolvedValue({ data: mockEvents });

// 			const result = await store.getState().getTaskEvents("task1");

// 			expect(mockedAxios.get).toHaveBeenCalledWith(
// 				expect.stringContaining("/api/activity/task1"),
// 			);

// 			expect(result).toEqual(mockEvents);

// 			const state = store.getState();
// 			expect(state.events).toEqual(mockEvents);
// 		});
// 	});

// 	describe("persist middleware", () => {
// 		it("should persist the state to sessionStorage", () => {
// 			const mockEvent: ActivityType = {
// 				id: "activity1",
// 				createdAt: new Date(),
// 				type: "TASK_EVENT",
// 				eventLogId: "eventLog1",
// 				taskEvent: {
// 					id: "1",
// 					type: "CREATED",
// 					authorId: "author1",
// 					authorName: "Author Name",
// 					activityId: "activity1",
// 					createdAt: new Date(),
// 					taskId: "task1",
// 					originalValue: null,
// 					updatedValue: null,
// 					originalAssigneeId: null,
// 					originalAssigneeName: null,
// 					updatedAssigneeId: null,
// 					updatedAssigneeName: null,
// 					gitUpdated: null,
// 					originalLabels: [],
// 					updatedLabels: [],
// 				},
// 				commit: null,
// 			};

// 			store.setState({ events: [mockEvent] });

// 			expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
// 				"activity-store",
// 				expect.any(String),
// 			);

// 			const setItemCall = window.sessionStorage.setItem.mock.calls[0];
// 			const persistedState = JSON.parse(setItemCall[1]);
// 			expect(persistedState.state.events).toEqualWithDatePrecision(
// 				[mockEvent],
// 				0,
// 			);
// 		});

// 		it("should hydrate the state from sessionStorage", () => {
// 			const mockEvent: ActivityType = {
// 				id: "activity1",
// 				createdAt: new Date(),
// 				type: "TASK_EVENT",
// 				eventLogId: "eventLog1",
// 				taskEvent: {
// 					id: "1",
// 					type: "CREATED",
// 					authorId: "author1",
// 					authorName: "Author Name",
// 					activityId: "activity1",
// 					createdAt: new Date(),
// 					taskId: "task1",
// 					originalValue: null,
// 					updatedValue: null,
// 					originalAssigneeId: null,
// 					originalAssigneeName: null,
// 					updatedAssigneeId: null,
// 					updatedAssigneeName: null,
// 					gitUpdated: null,
// 					originalLabels: [],
// 					updatedLabels: [],
// 				},
// 				commit: null,
// 			};

// 			const mockStoredState = JSON.stringify({
// 				state: { events: [mockEvent] },
// 			});

// 			window.sessionStorage.getItem.mockReturnValue(mockStoredState);

// 			const newStore = createActivityStore();
// 			const state = newStore.getState();

// 			expect(state.events).toEqualWithDatePrecision([mockEvent], 0);
// 		});
// 	});
// });
