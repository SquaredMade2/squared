import { STANDARD_TEAM, STANDARD_TEAM_2 } from "@/test/mocks";
import type { Team } from "@squared/db";
import axios from "axios";
import { createTeamStore } from ".";

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
});
