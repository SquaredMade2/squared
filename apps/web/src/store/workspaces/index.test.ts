import { createWorkspaceStore } from ".";

// Mock axios
jest.mock("axios");

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

	beforeEach(() => {
		store = createWorkspaceStore();
		jest.clearAllMocks();
	});

	it("should initialize with empty workspaces and null currentWorkspace", () => {
		const state = store.getState();
		expect(state.workspaces).toEqual([]);
		expect(state.workspace).toBeNull();
	});
});
