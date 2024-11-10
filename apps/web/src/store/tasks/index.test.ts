import { createTaskStore } from ".";

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
});
