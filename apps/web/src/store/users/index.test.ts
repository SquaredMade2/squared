import { STANDARD_USER, STANDARD_WORKSPACE } from "@/test/mocks";
import type { User } from "@squared/db";
import axios from "axios";
import { type UserAvatar, createUserStore } from ".";

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

	describe("addUser", () => {
		it("should add a user and update the state", async () => {
			const mockUser: Partial<User> = {
				name: "New User",
				email: "newuser@example.com",
			};

			const mockResponse = {
				data: {
					data: { id: "mocked-uuid", ...mockUser } as User,
					message: "User added successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().addUser(mockUser);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining("/api/user/mocked-uuid"),
				{ ...mockUser, id: "mocked-uuid" },
			);

			expect(result).toEqual({
				user: mockResponse.data.data,
				message: "User added successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.users).toHaveLength(1);
			expect(state.users[0]).toEqual(mockResponse.data.data);
		});
	});

	describe("updateUser", () => {
		it("should update a user and update the state", async () => {
			store.setState({ users: [STANDARD_USER] });

			const updatedUser: Partial<User> = {
				name: "Updated User",
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_USER, ...updatedUser },
					message: "User updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.updateUser(STANDARD_USER.id, updatedUser);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(`/api/user/${STANDARD_USER.id}`),
				updatedUser,
			);

			expect(result).toEqual({
				user: mockResponse.data.data,
				message: "User updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.users).toHaveLength(1);
			expect(state.users[0].name).toBe("Updated User");
		});
	});

	describe("deleteUser", () => {
		it("should delete a user and update the state", async () => {
			store.setState({ users: [STANDARD_USER] });

			mockedAxios.delete.mockResolvedValue({});

			await store.getState().deleteUser(STANDARD_USER.id);

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				expect.stringContaining(`/api/user/${STANDARD_USER.id}`),
			);

			const state = store.getState();
			expect(state.users).toHaveLength(0);
		});
	});

	describe("getUser", () => {
		it("should return an existing user from the state", async () => {
			store.setState({ users: [STANDARD_USER] });

			const result = await store.getState().getUser(STANDARD_USER.id);

			expect(result).toEqual({
				user: STANDARD_USER,
				message: "User found",
				variant: "default",
			});

			expect(mockedAxios.get).not.toHaveBeenCalled();
		});

		it("should fetch a user from the API if not in state", async () => {
			const mockResponse = {
				data: {
					data: STANDARD_USER,
					message: "User fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getUser(STANDARD_USER.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/user/${STANDARD_USER.id}`),
			);

			expect(result).toEqual({
				user: STANDARD_USER,
				message: "User fetched successfully",
				variant: "default",
			});
		});
	});

	describe("getAllUsers", () => {
		it("should fetch all users for a workspace and update the state", async () => {
			const mockUsers = [STANDARD_USER];

			const mockResponse = {
				data: {
					data: mockUsers,
					message: "Users fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getAllUsers(STANDARD_WORKSPACE.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/workspace/${STANDARD_WORKSPACE.id}/user`),
			);

			expect(result).toEqual(mockUsers);

			const state = store.getState();
			expect(state.users).toEqual(mockUsers);
		});
	});

	describe("getUserAvatars", () => {
		it("should fetch user avatars and update the state", async () => {
			const mockAvatars: UserAvatar[] = [
				{
					id: "avatar-1",
					name: "Avatar 1",
					avatarUrl: "https://example.com/avatar1.jpg",
				},
			];

			const mockResponse = {
				data: {
					data: mockAvatars,
					message: "Avatars fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getUserAvatars(STANDARD_USER.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/user/${STANDARD_USER.id}/avatar`),
			);

			expect(result).toEqual(mockAvatars);

			const state = store.getState();
			expect(state.userAvatars).toEqual(mockAvatars);
		});
	});

	describe("getUserRepositories", () => {
		it("should fetch user repositories and update the state", async () => {
			const mockRepositories = ["repo1", "repo2"];

			const mockResponse = {
				data: {
					data: mockRepositories,
					message: "Repositories fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.getUserRepositories(STANDARD_USER.id);

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining(`/api/user/${STANDARD_USER.id}/repositories`),
			);

			expect(result).toEqual(mockRepositories);

			const state = store.getState();
			expect(state.connectedRepos).toEqual(mockRepositories);
		});
	});
});
