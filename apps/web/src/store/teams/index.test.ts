import { createTeamStore } from ".";
import axios from "axios";
import type { Sprint, Team } from "@squared/db";
import { STANDARD_SPRINT, STANDARD_TEAM, STANDARD_TEAM_2 } from "@/test/mocks";
import { sprintService } from "@/lib/services";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
		expect(state.sprints).toEqual([]);
		expect(state.currentTeam).toBeNull();
		expect(state.currentSprint).toBeNull();
	});

	describe("addTeam", () => {
		it("should add a team and update the state", async () => {
			const mockTeam: Partial<Team> = {
				name: "New Team",
				identifier: "TSK",
				workspaceId: "workspace-1",
			};

			const mockResponse = {
				data: {
					data: { id: "mocked-uuid", ...mockTeam } as Team,
					message: "Team added successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().addTeam(mockTeam);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining("/api/team/mocked-uuid"),
				mockTeam,
			);

			expect(result).toEqual({
				team: mockResponse.data.data,
				message: "Team added successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.teams).toHaveLength(1);
			expect(state.teams[0]).toEqual(mockResponse.data.data);
		});
	});

	describe("getTeam", () => {
		it("should return an existing team from the state", async () => {
			store.setState({ teams: [STANDARD_TEAM] });

			const result = await store.getState().getTeam(STANDARD_TEAM.id);

			expect(result).toEqual({
				team: STANDARD_TEAM,
				message: "Team found",
				variant: "default",
			});

			expect(mockedAxios.get).not.toHaveBeenCalled();
		});

		it("should fetch a team from the API if not in state", async () => {
			const mockResponse = {
				data: {
					data: STANDARD_TEAM,
					message: "Team fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getTeam(STANDARD_TEAM.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/team/${STANDARD_TEAM.id}`),
			);

			expect(result).toEqual({
				team: STANDARD_TEAM,
				message: "Team fetched successfully",
				variant: "default",
			});
		});
	});

	describe("updateTeam", () => {
		it("should update a team and update the state", async () => {
			store.setState({ teams: [STANDARD_TEAM] });

			const updatedTeam: Partial<Team> = {
				name: "Updated Team",
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_TEAM, ...updatedTeam },
					message: "Team updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.updateTeam(STANDARD_TEAM.id, updatedTeam);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(`/api/team/${STANDARD_TEAM.id}`),
				updatedTeam,
			);

			expect(result).toEqual({
				team: mockResponse.data.data,
				message: "Team updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.teams).toHaveLength(1);
			expect(state.teams[0].name).toBe("Updated Team");
		});
	});

	describe("deleteTeam", () => {
		it("should delete a team and update the state", async () => {
			store.setState({ teams: [STANDARD_TEAM] });

			mockedAxios.delete.mockResolvedValue({});

			await store.getState().deleteTeam(STANDARD_TEAM.id);

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				expect.stringContaining(`/api/team/${STANDARD_TEAM.id}`),
			);

			const state = store.getState();
			expect(state.teams).toHaveLength(0);
		});
	});

	describe("getAllTeams", () => {
		it("should fetch all teams for a workspace and update the state", async () => {
			const mockTeams = [STANDARD_TEAM, STANDARD_TEAM_2];

			const mockResponse = {
				data: {
					data: mockTeams,
					message: "Teams fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getAllTeams("workspace-1");

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(
					"http://localhost:5173/api/user/workspace-1/team",
				),
			);

			expect(result).toEqual(mockTeams);

			const state = store.getState();
			expect(state.teams).toEqual(mockTeams);
		});
	});

	describe("initializeSprints", () => {
		it("should initialize sprints for a team", async () => {
			// Mock existing sprints (empty in this case)
			const mockExistingSprints: Sprint[] = [];

			// Mock new sprints to be created
			const mockSprints: Sprint[] = [
				{ ...STANDARD_SPRINT, id: "sprint-1" },
				{ ...STANDARD_SPRINT, id: "sprint-2" },
			];

			// Mock sprintService.getSprints to return the existing sprints
			(sprintService.getSprints as jest.Mock).mockResolvedValue(
				mockExistingSprints,
			);

			// Mock the response for creating new sprints via the backend
			const mockPostResponse = {
				data: {
					data: mockSprints,
					message: "Sprints initialized successfully",
					variant: "default",
				},
			};

			// Replace `axios.post` with whatever function you're using for RPC or HTTP requests
			jest.spyOn(axios, "post").mockResolvedValue(mockPostResponse);

			// Call the function to initialize sprints
			const result = await store
				.getState()
				.initializeSprints(STANDARD_TEAM.id, {
					count: 3,
					startDate: new Date("2023-01-01"),
				});

			// Verify that the function returns the newly created sprints
			expect(result).toEqual(mockSprints);

			// Verify that the state is updated with the new sprints
			const state = store.getState();
			expect(state.sprints).toEqual(mockSprints);

			// Verify that sprintService.getSprints was called with the correct arguments
			expect(sprintService.getSprints).toHaveBeenCalledWith(expect.anything(), {
				teamId: STANDARD_TEAM.id,
			});

			// Verify that the POST request to create sprints was called correctly
			expect(axios.post).toHaveBeenCalledWith(
				expect.stringContaining(`${STANDARD_TEAM.id}/sprints`),
				expect.objectContaining({
					count: expect.any(Number), // This should be the modified count based on the pending sprints
					startDate: expect.any(Date),
				}),
			);
		});
	});

	describe("persist middleware", () => {
		it("should hydrate the state from sessionStorage", () => {
			const mockState = {
				teams: [STANDARD_TEAM],
				currentTeam: null,
				sprints: [],
				currentSprint: null,
			};
			mockSessionStorage.getItem.mockReturnValue(
				JSON.stringify({ state: mockState }),
			);

			const newStore = createTeamStore();
			const state = newStore.getState();

			expect(state.teams).toEqualWithDatePrecision([STANDARD_TEAM]);
			expect(state.currentTeam).toBeNull();
			expect(state.sprints).toEqual([]);
			expect(state.currentSprint).toBeNull();
		});
	});
});
