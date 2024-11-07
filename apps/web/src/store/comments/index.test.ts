import { createCommentStore } from ".";

// Mock axios
jest.mock("axios");

// Mock uuid
jest.mock("uuid", () => ({
	v4: jest.fn(() => "mocked-uuid"),
}));

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
	console.error = jest.fn();
});

afterAll(() => {
	console.error = originalConsoleError;
});

describe("CommentStore", () => {
	let store: ReturnType<typeof createCommentStore>;

	beforeEach(() => {
		store = createCommentStore();
		jest.clearAllMocks();
	});

	it("should initialize with an empty comments array", () => {
		const state = store.getState();
		expect(state.comments).toEqual([]);
	});
});
