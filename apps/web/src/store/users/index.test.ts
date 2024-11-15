import { createUserStore } from ".";

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

describe("UserStore", () => {
	let store: ReturnType<typeof createUserStore>;

	beforeEach(() => {
		store = createUserStore();
		jest.clearAllMocks();
	});

	it("should initialize with empty users, userAvatars, and connectedRepos", () => {
		const state = store.getState();
		expect(state.users).toEqual([]);
		expect(state.userAvatars).toEqual([]);
		expect(state.connectedRepos).toEqual([]);
	});
});
