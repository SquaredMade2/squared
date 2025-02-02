import type { GetNotificationsResponse } from "@/gen/rpc/event";
import { DEFAULT_LABELS } from "@/test/mocks";
import type { TaskEvent } from "@squared/db";
import { type EventStore, createEventStore } from ".";

describe("Event Store", () => {
	let store: ReturnType<typeof createEventStore>;
	let initialState: EventStore;

	beforeEach(() => {
		store = createEventStore();
		initialState = store.getState();
	});

	it("should initialize with empty arrays", () => {
		expect(initialState.events).toEqual([]);
		expect(initialState.notifications).toEqual([]);
		expect(initialState.commits).toEqual([]);
	});

	it("should set notifications", () => {
		const mockNotifications: GetNotificationsResponse = [
			{
				id: "1",
				taskId: "task1",
				userId: "user1",
				read: false,
				type: "ASSIGNED",
				Task: {
					assigneeId: null,
					authorId: "",
					dateCreated: new Date(),
					deleted: false,
					description: null,
					dueDate: null,
					effortEstimate: null,
					id: "",
					identifier: "",
					labels: [],
					parentId: null,
					priority: "noPriority",
					sprintId: null,
					status: "backlog",
					teamId: "",
					title: "",
					order: 0,
					updatedAt: new Date(),
					workspaceId: "",
				},
				Workspace: {
					admins: [],
					avatarUrl: null,
					companySize: null,
					id: "",
					name: "",
					labels: DEFAULT_LABELS,
					tasksCreated: 0,
					universalTokenLinkId: null,
					url: "",
					defaultView: null,
					createdAt: new Date(),
				},
				createdAt: new Date(),
				description: null,
				dismissed: false,
				saved: false,
				updatedAt: new Date(),
				workspaceId: "",
			},
			{
				id: "2",
				taskId: "task2",
				userId: "user2",
				read: true,
				type: "PARTICIPATING",
				Task: {
					assigneeId: null,
					authorId: "",
					dateCreated: new Date(),
					deleted: false,
					description: null,
					dueDate: null,
					order: 0,
					effortEstimate: null,
					id: "",
					identifier: "",
					labels: [],
					parentId: null,
					priority: "noPriority",
					sprintId: null,
					status: "backlog",
					teamId: "",
					title: "",
					updatedAt: new Date(),
					workspaceId: "",
				},
				Workspace: {
					admins: [],
					avatarUrl: null,
					companySize: null,
					labels: DEFAULT_LABELS,
					id: "",
					name: "",
					tasksCreated: 0,
					universalTokenLinkId: null,
					url: "",
					createdAt: new Date(),

					defaultView: null,
				},
				createdAt: new Date(),
				description: null,
				dismissed: false,
				saved: false,
				updatedAt: new Date(),
				workspaceId: "",
			},
		];

		store.setState({ notifications: mockNotifications });

		expect(store.getState().notifications).toEqual(mockNotifications);
	});

	it("should set events", () => {
		const mockEvents: TaskEvent[] = [
			{
				id: "1",
				taskId: "task1",
				authorId: "user1",
				message: "Event 1",
				createdAt: new Date(),
			},
			{
				id: "2",
				taskId: "task2",
				authorId: "user2",
				message: "Event 2",
				createdAt: new Date(),
			},
		];

		store.getState().setEvents(mockEvents);

		expect(store.getState().events).toEqual(mockEvents);
	});

	it("should set commits", () => {
		const mockCommits: TaskEvent[] = [
			{
				id: "1",
				taskId: "task1",
				authorId: "user1",
				message: "Commit 1",
				createdAt: new Date(),
			},
			{
				id: "task2",
				taskId: "task2",
				authorId: "user2",
				message: "Commit 2",
				createdAt: new Date(),
			},
		];

		store.getState().setCommits(mockCommits);

		expect(store.getState().commits).toEqual(mockCommits);
	});

	it("should not mutate previous state when setting new state", () => {
		const initialNotifications = store.getState().notifications;
		const newNotifications: GetNotificationsResponse = [
			{
				id: "1",
				taskId: "task1",
				userId: "user1",
				read: false,
				type: "ASSIGNED",
				Task: {
					assigneeId: null,
					authorId: "",
					dateCreated: new Date(),
					deleted: false,
					description: null,
					dueDate: null,
					effortEstimate: null,
					id: "",
					order: 0,
					identifier: "",
					labels: [],
					parentId: null,
					priority: "noPriority",
					sprintId: null,
					status: "backlog",
					teamId: "",
					title: "",
					updatedAt: new Date(),
					workspaceId: "",
				},
				Workspace: {
					admins: [],
					avatarUrl: null,
					companySize: null,
					id: "",
					labels: DEFAULT_LABELS,
					name: "",
					tasksCreated: 0,
					universalTokenLinkId: null,
					url: "",
					defaultView: null,
					createdAt: new Date(),
				},
				createdAt: new Date(),
				description: null,
				dismissed: false,
				saved: false,
				updatedAt: new Date(),
				workspaceId: "",
			},
		];

		store.setState({ notifications: newNotifications });

		expect(initialNotifications).not.toBe(store.getState().notifications);
		expect(initialNotifications).toEqual([]);
	});

	it("should handle empty arrays", () => {
		store.getState().setNotifications([]);
		store.getState().setEvents([]);
		store.getState().setCommits([]);

		expect(store.getState().notifications).toEqual([]);
		expect(store.getState().events).toEqual([]);
		expect(store.getState().commits).toEqual([]);
	});

	it("should maintain correct types for state properties", () => {
		const mockNotifications: GetNotificationsResponse = [
			{
				id: "1",
				taskId: "task1",
				userId: "user1",
				read: false,
				type: "ASSIGNED",
				Task: {
					assigneeId: null,
					authorId: "",
					dateCreated: new Date(),
					deleted: false,
					description: null,
					dueDate: null,
					effortEstimate: null,
					id: "",
					identifier: "",
					labels: [],
					parentId: null,
					priority: "noPriority",
					sprintId: null,
					status: "backlog",
					teamId: "",
					title: "",
					updatedAt: new Date(),
					workspaceId: "",
					order: 0,
				},
				Workspace: {
					admins: [],
					avatarUrl: null,
					companySize: null,
					id: "",
					labels: DEFAULT_LABELS,
					name: "",
					tasksCreated: 0,
					universalTokenLinkId: null,
					url: "",
					createdAt: new Date(),
					defaultView: null,
				},
				createdAt: new Date(),
				description: null,
				dismissed: false,
				saved: false,
				updatedAt: new Date(),
				workspaceId: "",
			},
		];
		const mockEvents: TaskEvent[] = [
			{
				id: "1",
				taskId: "task1",
				authorId: "user1",
				message: "Event 1",
				createdAt: new Date(),
			},
		];
		const mockCommits: TaskEvent[] = [
			{
				id: "1",
				taskId: "task1",
				authorId: "user1",
				message: "Commit 1",
				createdAt: new Date(),
			},
		];

		store.setState({
			notifications: mockNotifications,
			events: mockEvents,
			commits: mockCommits,
		});

		expect(Array.isArray(store.getState().notifications)).toBe(true);
		expect(Array.isArray(store.getState().events)).toBe(true);
		expect(Array.isArray(store.getState().commits)).toBe(true);

		expect(store.getState().notifications[0]).toHaveProperty("id");
		expect(store.getState().notifications[0]).toHaveProperty("taskId");
		expect(store.getState().notifications[0]).toHaveProperty("userId");
		expect(store.getState().notifications[0]).toHaveProperty("read");
		expect(store.getState().notifications[0]).toHaveProperty("type");

		expect(store.getState().events[0]).toHaveProperty("id");
		expect(store.getState().events[0]).toHaveProperty("taskId");
		expect(store.getState().events[0]).toHaveProperty("authorId");
		expect(store.getState().events[0]).toHaveProperty("message");
		expect(store.getState().events[0]).toHaveProperty("createdAt");

		expect(store.getState().commits[0]).toHaveProperty("id");
		expect(store.getState().commits[0]).toHaveProperty("taskId");
		expect(store.getState().commits[0]).toHaveProperty("authorId");
		expect(store.getState().commits[0]).toHaveProperty("message");
		expect(store.getState().commits[0]).toHaveProperty("createdAt");
	});
});
