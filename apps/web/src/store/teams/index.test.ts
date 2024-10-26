import { createTeamStore } from ".";
import axios from "axios";
import type { Sprint, Team } from "@repo/db";
import {
	STANDARD_RETROSPECTIVE_ITEM,
	STANDARD_SPRINT,
	STANDARD_TASK,
	STANDARD_TEAM,
	STANDARD_TEAM_2,
	STANDARD_TO_IMPROVE_ITEM,
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

describe("TeamStore", () => {
	let store: ReturnType<typeof createTeamStore>;

	beforeEach(() => {
		store = createTeamStore();
		jest.clearAllMocks();
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
				expect.stringContaining("/api/workspace/workspace-1/team"),
			);

			expect(result).toEqual(mockTeams);

			const state = store.getState();
			expect(state.teams).toEqual(mockTeams);
		});
	});

	describe("initializeSprints", () => {
		it("should initialize sprints for a team", async () => {
			const mockSprints: Sprint[] = [
				{ ...STANDARD_SPRINT, id: "sprint-1" },
				{ ...STANDARD_SPRINT, id: "sprint-2" },
			];

			const mockResponse = {
				data: {
					data: mockSprints,
					message: "Sprints initialized successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);
			mockedAxios.get.mockResolvedValue({ data: { data: [] } }); // Mock empty current sprints

			const result = await store
				.getState()
				.initializeSprints(STANDARD_TEAM.id, {
					count: 3,
					startDate: new Date("2023-01-01"),
				});

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining(`/api/team/${STANDARD_TEAM.id}/sprints`),
				{ count: 3, startDate: new Date("2023-01-01") },
			);

			expect(result).toEqual(mockSprints);

			const state = store.getState();
			expect(state.sprints).toEqual(mockSprints);
		});
	});

	describe("getSprints", () => {
		it("should fetch sprints for a team", async () => {
			const mockSprints: Sprint[] = [
				{ ...STANDARD_SPRINT, id: "sprint-1" },
				{ ...STANDARD_SPRINT, id: "sprint-2" },
			];

			const mockResponse = {
				data: {
					data: mockSprints,
					message: "Sprints fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getSprints(STANDARD_TEAM.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/team/${STANDARD_TEAM.id}/sprints`),
			);

			expect(result).toEqual(mockSprints);

			const state = store.getState();
			expect(state.sprints).toEqual(mockSprints);
		});
	});

	describe("updateSprint", () => {
		it("should update a sprint", async () => {
			const updatedSprint: Partial<Sprint> = {
				name: "Updated Sprint",
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_SPRINT, ...updatedSprint },
					message: "Sprint updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			store.setState({ sprints: [STANDARD_SPRINT] });

			const result = await store
				.getState()
				.updateSprint(STANDARD_TEAM.id, STANDARD_SPRINT.id, updatedSprint);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/team/${STANDARD_TEAM.id}/sprints/${STANDARD_SPRINT.id}`,
				),
				updatedSprint,
			);

			expect(result).toEqual({
				sprint: mockResponse.data.data,
				message: "Sprint updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.sprints[0]).toEqual(mockResponse.data.data);
		});
	});

	describe("startNextSprint", () => {
		it("should start the next sprint", async () => {
			const movedTasks = [STANDARD_TASK.id];
			const sprintData: Partial<Sprint> = {
				name: "Next Sprint",
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_SPRINT, ...sprintData, status: "ACTIVE" },
					message: "Next sprint started successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.startNextSprint(STANDARD_TEAM.id, movedTasks, sprintData);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(`/api/team/${STANDARD_TEAM.id}/sprints/next`),
				{ movedTasks, sprintData },
			);

			expect(result).toEqual({
				sprint: mockResponse.data.data,
				message: "Next sprint started successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.sprints).toContainEqual(mockResponse.data.data);
		});
	});

	describe("endSprint", () => {
		it("should end a sprint", async () => {
			const mockResponse = {
				data: {
					data: { ...STANDARD_SPRINT, status: "COMPLETED" },
					message: "Sprint ended successfully",
					variant: "default",
				},
			};

			mockedAxios.delete.mockResolvedValue(mockResponse);

			store.setState({ sprints: [STANDARD_SPRINT] });

			const result = await store
				.getState()
				.endSprint(STANDARD_TEAM.id, STANDARD_SPRINT.id);

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/team/${STANDARD_TEAM.id}/sprints/${STANDARD_SPRINT.id}/tasks`,
				),
			);

			expect(result).toEqual({
				sprint: mockResponse.data.data,
				message: "Sprint ended successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.sprints).toContainEqual(mockResponse.data.data);
		});
	});

	describe("addRetrospectiveItem", () => {
		it("should add a retrospective item", async () => {
			const mockResponse = {
				data: {
					data: STANDARD_RETROSPECTIVE_ITEM,
					message: "Retrospective item added successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			store.setState({ currentTeam: STANDARD_TEAM });

			const result = await store
				.getState()
				.addRetrospectiveItem(
					STANDARD_SPRINT.id,
					"wentWell",
					"Test retrospective item",
				);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/team/${STANDARD_TEAM.id}/sprints/${STANDARD_SPRINT.id}/retrospective`,
				),
				{ type: "wentWell", content: "Test retrospective item" },
			);

			expect(result).toEqual({
				item: STANDARD_RETROSPECTIVE_ITEM,
				message: "Retrospective item added successfully",
				variant: "default",
			});
		});
	});

	describe("updateRetrospectiveItemType", () => {
		it("should update a retrospective item type", async () => {
			const mockResponse = {
				data: {
					data: STANDARD_TO_IMPROVE_ITEM,
					message: "Retrospective item updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			store.setState({ currentTeam: STANDARD_TEAM });

			const result = await store
				.getState()
				.updateRetrospectiveItemType(
					STANDARD_SPRINT.id,
					"retro-1",
					"toImprove",
				);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/team/${STANDARD_TEAM.id}/sprints/${STANDARD_SPRINT.id}/retrospective`,
				),
				{ itemId: "retro-1", type: "toImprove" },
			);

			expect(result).toEqual({
				item: STANDARD_TO_IMPROVE_ITEM,
				message: "Retrospective item updated successfully",
				variant: "default",
			});
		});
	});

	describe("getRetrospectiveItems", () => {
		it("should fetch retrospective items for a sprint", async () => {
			const mockRetrospectiveData = {
				wentWell: [
					{
						id: "retro-1",
						content: "Went well item",
						type: "wentWell",
						sprintId: STANDARD_SPRINT.id,
					},
				],
				toImprove: [
					{
						id: "retro-2",
						content: "To improve item",
						type: "toImprove",
						sprintId: STANDARD_SPRINT.id,
					},
				],
				actionItems: [
					{
						id: "retro-3",
						content: "Action item",
						type: "actionItems",
						sprintId: STANDARD_SPRINT.id,
					},
				],
			};

			const mockResponse = {
				data: {
					data: mockRetrospectiveData,
					message: "Retrospective items fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			store.setState({ currentTeam: STANDARD_TEAM });

			const result = await store
				.getState()
				.getRetrospectiveItems(STANDARD_SPRINT.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(
					`/api/team/${STANDARD_TEAM.id}/sprints/${STANDARD_SPRINT.id}/retrospective`,
				),
			);

			expect(result).toEqual(mockRetrospectiveData);
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
