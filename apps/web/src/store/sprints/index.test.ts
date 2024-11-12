import { createSprintStore } from ".";

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

describe("SprintStore", () => {
	let store: ReturnType<typeof createSprintStore>;

	beforeEach(() => {
		store = createSprintStore();
		jest.clearAllMocks();
	});

	it("should initialize with an empty sprints array and null currentSprint", () => {
		const state = store.getState();
		expect(state.sprints).toEqual([]);
		expect(state.sprint).toBeNull();
	});
});
