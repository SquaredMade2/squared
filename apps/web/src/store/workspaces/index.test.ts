import { createWorkspaceStore } from ".";
import axios from "axios";
import type { Workspace } from ".";
import {
	STANDARD_WORKSPACE,
	STANDARD_USER,
	STANDARD_LABEL,
	STANDARD_LABEL_2,
	STANDARD_LABEL_3,
} from "@/test/mocks";

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

describe("WorkspaceStore", () => {
	let store: ReturnType<typeof createWorkspaceStore>;
	const WORKSPACE_LABELS = {
		...STANDARD_WORKSPACE,
		Labels: [STANDARD_LABEL, STANDARD_LABEL_2, STANDARD_LABEL_3],
	};

	beforeEach(() => {
		store = createWorkspaceStore();
		jest.clearAllMocks();
	});

	it("should initialize with empty workspaces and null currentWorkspace", () => {
		const state = store.getState();
		expect(state.workspaces).toEqual([]);
		expect(state.currentWorkspace).toBeNull();
	});

	describe("addWorkspace", () => {
		it("should add a workspace and update the state", async () => {
			const mockWorkspace: Partial<Workspace> = {
				name: "New Workspace",
				url: "new-workspace",
			};

			const mockResponse = {
				data: {
					data: {
						id: "mocked-uuid",
						...mockWorkspace,
						Labels: [],
					} as Workspace,
					message: "Workspace added successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.addWorkspace(mockWorkspace, STANDARD_USER.id);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining("/api/workspace/mocked-uuid"),
				expect.objectContaining({
					workspace: expect.objectContaining(mockWorkspace),
					userId: STANDARD_USER.id,
				}),
			);

			expect(result).toEqual({
				workspace: mockResponse.data.data,
				message: "Workspace added successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.workspaces).toHaveLength(1);
			expect(state.workspaces[0]).toEqual(mockResponse.data.data);
			expect(state.currentWorkspace).toEqual(mockResponse.data.data);
		});
	});

	describe("getWorkspace", () => {
		it("should return an existing workspace from the state", async () => {
			store.setState({ workspaces: [WORKSPACE_LABELS] });

			const result = await store.getState().getWorkspace(STANDARD_WORKSPACE.id);

			expect(result).toEqual({
				workspace: WORKSPACE_LABELS,
				message: "Workspace found successfully",
				variant: "default",
			});

			expect(mockedAxios.get).not.toHaveBeenCalled();
		});

		it("should fetch a workspace from the API if not in state", async () => {
			const mockResponse = {
				data: {
					data: STANDARD_WORKSPACE,
					message: "Workspace fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getWorkspace(STANDARD_WORKSPACE.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/workspace/${STANDARD_WORKSPACE.id}`),
			);

			expect(result).toEqual({
				workspace: STANDARD_WORKSPACE,
				message: "Workspace fetched successfully",
				variant: "default",
			});
		});
	});

	describe("updateWorkspace", () => {
		it("should update a workspace and update the state", async () => {
			store.setState({ workspaces: [WORKSPACE_LABELS] });

			const updatedWorkspace: Partial<Workspace> = {
				name: "Updated Workspace",
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_WORKSPACE, ...updatedWorkspace },
					message: "Workspace updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.updateWorkspace(STANDARD_WORKSPACE.id, updatedWorkspace);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(`/api/workspace/${STANDARD_WORKSPACE.id}`),
				updatedWorkspace,
			);

			expect(result).toEqual({
				workspace: mockResponse.data.data,
				message: "Workspace updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.workspaces).toHaveLength(1);
			expect(state.workspaces[0].name).toBe("Updated Workspace");
		});
	});

	describe("deleteWorkspace", () => {
		it("should delete a workspace and update the state", async () => {
			store.setState({ workspaces: [WORKSPACE_LABELS] });

			mockedAxios.delete.mockResolvedValue({});

			await store.getState().deleteWorkspace(STANDARD_WORKSPACE.id);

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				expect.stringContaining(`/api/workspace/${STANDARD_WORKSPACE.id}`),
			);

			const state = store.getState();
			expect(state.workspaces).toHaveLength(0);
		});
	});

	describe("getAllWorkspaces", () => {
		it("should fetch all workspaces for a user and update the state", async () => {
			const mockWorkspaces = [STANDARD_WORKSPACE];

			const mockResponse = {
				data: {
					data: mockWorkspaces,
					message: "Workspaces fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getAllWorkspaces(STANDARD_USER.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/user/${STANDARD_USER.id}/workspace`),
			);

			expect(result).toEqual(mockWorkspaces);

			const state = store.getState();
			expect(state.workspaces).toEqual(mockWorkspaces);
		});
	});

	describe("inviteToWorkspace", () => {
		it("should send an invitation to join a workspace", async () => {
			const email = "test@example.com";

			mockedAxios.post.mockResolvedValue({
				data: { message: "Invitation sent" },
			});

			await store.getState().inviteToWorkspace(STANDARD_WORKSPACE.id, email);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/workspace/${STANDARD_WORKSPACE.id}/invite`,
				),
				{ email },
			);
		});
	});

	describe("joinWorkspace", () => {
		it("should join a workspace and update the state", async () => {
			const token = "invite-token";
			const mockResponse = {
				data: {
					data: STANDARD_WORKSPACE,
					message: "Joined workspace successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.joinWorkspace(token, STANDARD_USER.id);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining("/api/workspace/join"),
				{ token, userId: STANDARD_USER.id },
			);

			expect(result).toEqual({
				workspace: STANDARD_WORKSPACE,
				message: "Joined workspace successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.workspaces).toContainEqual(STANDARD_WORKSPACE);
			expect(state.currentWorkspace).toEqual(STANDARD_WORKSPACE);
		});
	});

	describe("persist middleware", () => {
		it("should hydrate the state from sessionStorage", () => {
			const mockState = {
				workspaces: [STANDARD_WORKSPACE],
				currentWorkspace: STANDARD_WORKSPACE,
			};
			mockSessionStorage.getItem.mockReturnValue(
				JSON.stringify({ state: mockState }),
			);

			const newStore = createWorkspaceStore();
			const state = newStore.getState();

			expect(state.workspaces).toEqual([STANDARD_WORKSPACE]);
			expect(state.currentWorkspace).toEqual(STANDARD_WORKSPACE);
		});
	});
});
