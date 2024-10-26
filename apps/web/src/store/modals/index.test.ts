import { createModalStore } from ".";
import type { Task } from "@repo/db";

describe("ModalStore", () => {
	let store: ReturnType<typeof createModalStore>;

	beforeEach(() => {
		store = createModalStore();
	});

	it("should initialize with default values", () => {
		const state = store.getState();
		expect(state).toEqual({
			showNewIssue: false,
			showCommand: false,
			showRename: false,
			renameData: null,
			showWorkspaceInvite: false,
			showSwitchWorkspace: false,
			showTaskSelector: false,
			newIssueData: {},
			setShowNewIssue: expect.any(Function),
			setShowRename: expect.any(Function),
			setRenameData: expect.any(Function),
			setNewIssueData: expect.any(Function),
			setShowCommand: expect.any(Function),
			setShowWorkspaceInvite: expect.any(Function),
			setShowSwitchWorkspace: expect.any(Function),
			setShowTaskSelector: expect.any(Function),
		});
	});

	describe("setShowNewIssue", () => {
		it("should update showNewIssue state", () => {
			store.getState().setShowNewIssue(true);
			expect(store.getState().showNewIssue).toBe(true);

			store.getState().setShowNewIssue(false);
			expect(store.getState().showNewIssue).toBe(false);
		});
	});

	describe("setShowRename", () => {
		it("should update showRename state", () => {
			store.getState().setShowRename(true);
			expect(store.getState().showRename).toBe(true);

			store.getState().setShowRename(false);
			expect(store.getState().showRename).toBe(false);
		});
	});

	describe("setRenameData", () => {
		it("should update renameData state", () => {
			const mockTask: Task = {
				id: "1",
				title: "Test Task",
				status: "todo",
				authorId: "user1",
				identifier: "TSK-001",
				description: null,
				dueDate: null,
				effortEstimate: null,
				teamId: "team1",
				dateCreated: new Date(),
				assigneeId: null,
				assigneeName: null,
				labels: [],
				workspaceId: "workspace1",
				updatedAt: new Date(),
				deleted: false,
				parentId: null,
				sprintId: null,
				priority: "medium",
			};

			store.getState().setRenameData(mockTask);
			expect(store.getState().renameData).toEqual(mockTask);
		});
	});

	describe("setNewIssueData", () => {
		it("should update newIssueData state", () => {
			const mockNewIssueData: Partial<Task> = {
				title: "New Task",
				status: "todo",
				priority: "high",
			};

			store.getState().setNewIssueData(mockNewIssueData);
			expect(store.getState().newIssueData).toEqual(mockNewIssueData);
		});
	});

	describe("setShowCommand", () => {
		it("should update showCommand state", () => {
			store.getState().setShowCommand(true);
			expect(store.getState().showCommand).toBe(true);

			store.getState().setShowCommand(false);
			expect(store.getState().showCommand).toBe(false);
		});
	});

	describe("setShowWorkspaceInvite", () => {
		it("should update showWorkspaceInvite state", () => {
			store.getState().setShowWorkspaceInvite(true);
			expect(store.getState().showWorkspaceInvite).toBe(true);

			store.getState().setShowWorkspaceInvite(false);
			expect(store.getState().showWorkspaceInvite).toBe(false);
		});
	});

	describe("setShowSwitchWorkspace", () => {
		it("should update showSwitchWorkspace state", () => {
			store.getState().setShowSwitchWorkspace(true);
			expect(store.getState().showSwitchWorkspace).toBe(true);

			store.getState().setShowSwitchWorkspace(false);
			expect(store.getState().showSwitchWorkspace).toBe(false);
		});
	});

	describe("setShowTaskSelector", () => {
		it("should update showTaskSelector state", () => {
			store.getState().setShowTaskSelector(true);
			expect(store.getState().showTaskSelector).toBe(true);

			store.getState().setShowTaskSelector(false);
			expect(store.getState().showTaskSelector).toBe(false);
		});
	});
});
