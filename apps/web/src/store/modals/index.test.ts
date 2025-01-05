import { STANDARD_TASK } from "@/test/mocks";
import type { Task } from "@squared/db";
import { createModalStore } from ".";

describe("ModalStore", () => {
	let store: ReturnType<typeof createModalStore>;

	beforeEach(() => {
		store = createModalStore();
	});

	it("should initialize with default values", () => {
		const state = store.getState();
		expect(state).toEqual({
			showNewTask: false,
			newTaskData: {},
			showRename: false,
			renameData: null,
			showLabelModal: false,
			labelData: {},
			showCommand: false,
			showWorkspaceInvite: false,
			showSwitchWorkspace: false,
			showTaskSelector: false,
			showLinkForm: false,
			setShowNewTask: expect.any(Function),
			setNewTaskData: expect.any(Function),
			setShowRename: expect.any(Function),
			setRenameData: expect.any(Function),
			setShowLabelModal: expect.any(Function),
			setLabelData: expect.any(Function),
			setShowCommand: expect.any(Function),
			setShowWorkspaceInvite: expect.any(Function),
			setShowSwitchWorkspace: expect.any(Function),
			setShowTaskSelector: expect.any(Function),
			setShowLinkForm: expect.any(Function),
		});
	});

	describe("setShowNewTask", () => {
		it("should update showNewTask state", () => {
			store.getState().setShowNewTask(true);
			expect(store.getState().showNewTask).toBe(true);

			store.getState().setShowNewTask(false);
			expect(store.getState().showNewTask).toBe(false);
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
			store.getState().setRenameData(STANDARD_TASK);
			expect(store.getState().renameData).toEqual(STANDARD_TASK);
		});
	});

	describe("setNewTaskData", () => {
		it("should update newTaskData state", () => {
			const mockNewTaskData: Partial<Task> = {
				title: "New Task",
				status: "todo",
				priority: "high",
			};

			store.getState().setNewTaskData(mockNewTaskData);
			expect(store.getState().newTaskData).toEqual(mockNewTaskData);
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
