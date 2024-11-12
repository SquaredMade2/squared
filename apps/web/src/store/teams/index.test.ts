import { createTeamStore } from "."; // Mock axios
jest.mock("axios");

jest.mock("@/lib/services", () => ({
	sprintService: {
		getSprints: jest.fn(),
	},
}));

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

describe("TeamStore", () => {
	let store: ReturnType<typeof createTeamStore>;

	beforeEach(() => {
		store = createTeamStore();
		jest.clearAllMocks();
		process.env.NEXT_PUBLIC_SERVER = "http://localhost:5173";
	});

	it("should initialize with empty teams, sprints, and null current team and sprint", () => {
		const state = store.getState();
		expect(state.teams).toEqual([]);
		expect(state.team).toBeNull();
	});
});
