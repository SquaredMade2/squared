import { createAuthStore } from ".";
import axios from "axios";
import { signOut } from "next-auth/react";
import type { User } from "@repo/db";

// Mock axios and next-auth
jest.mock("axios");
jest.mock("next-auth/react");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSignOut = signOut as jest.MockedFunction<typeof signOut>;

// Mock window.location
const mockWindowLocation = {
	href: "",
};
Object.defineProperty(window, "location", {
	value: mockWindowLocation,
	writable: true,
});

// Mock sessionStorage
const mockSessionStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
	value: mockSessionStorage,
});

describe("AuthStore", () => {
	let store: ReturnType<typeof createAuthStore>;

	beforeEach(() => {
		store = createAuthStore();
		jest.clearAllMocks();
		window.sessionStorage.clear();
	});

	it("should initialize with a null user", () => {
		const state = store.getState();
		expect(state.user).toBeNull();
	});

	describe("login", () => {
		it("should update the user state on successful login", async () => {
			const mockUser: User = {
				id: "1",
				name: "Test User",
				email: "test@example.com",
				username: "testuser",
			} as User;

			const mockResponse = {
				data: {
					data: mockUser,
					message: "Login successful",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().login({
				provider: "credentials",
				type: "login",
				email: "test@example.com",
				password: "password123",
			});

			expect(result).toEqual({
				user: mockUser,
				message: "Login successful",
				variant: "default",
			});

			const state = store.getState();
			expect(state.user).toEqual(mockUser);
		});
	});

	describe("register", () => {
		it("should update the user state on successful registration", async () => {
			const mockUser: User = {
				id: "1",
				name: "New User",
				email: "newuser@example.com",
				username: "newuser",
			} as User;

			const mockResponse = {
				data: {
					data: mockUser,
					message: "Registration successful",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().register({
				provider: "credentials",
				type: "register",
				email: "newuser@example.com",
				password: "password123",
				name: "New User",
				username: "newuser",
			});

			expect(result).toEqual({
				user: mockUser,
				message: "Registration successful",
				variant: "default",
			});

			const state = store.getState();
			expect(state.user).toEqual(mockUser);
		});
	});

	describe("verifyUser", () => {
		it("should update the user state on successful verification", async () => {
			const mockUser: User = {
				id: "1",
				name: "Verified User",
				email: "verified@example.com",
				username: "verifieduser",
			} as User;

			const mockResponse = {
				data: {
					user: mockUser,
					message: "User verified",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().verifyUser("valid-token");

			expect(result).toEqual({
				user: mockUser,
				message: "User verified",
				variant: "default",
			});

			const state = store.getState();
			expect(state.user).toEqual(mockUser);
		});
	});

	describe("logout", () => {
		it("should clear the user state and session storage on logout", async () => {
			const mockUser: User = {
				id: "1",
				name: "Test User",
				email: "test@example.com",
				username: "testuser",
			} as User;

			store.setState({ user: mockUser });

			mockedAxios.post.mockResolvedValue({ data: true });
			mockedSignOut.mockResolvedValue(undefined);

			const result = await store.getState().logout();

			expect(result).toBe(true);
			expect(store.getState().user).toBeNull();
			expect(mockSessionStorage.clear).toHaveBeenCalled();
			expect(mockedSignOut).toHaveBeenCalledWith({ redirect: false });
			expect(mockWindowLocation.href).toBe("/login");
		});
	});

	describe("resetPasswordEmail", () => {
		it("should return the correct response for reset password email", async () => {
			const mockResponse = {
				data: {
					user: null,
					message: "Reset password email sent",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.resetPasswordEmail("test@example.com");

			expect(result).toEqual({
				user: null,
				message: "Reset password email sent",
				variant: "default",
			});
		});
	});

	describe("resetPassword", () => {
		it("should return the correct response for password reset", async () => {
			const mockResponse = {
				data: {
					user: null,
					message: "Password reset successful",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.resetPassword("valid-token", "newpassword123");

			expect(result).toEqual({
				user: null,
				message: "Password reset successful",
				variant: "default",
			});
		});
	});

	describe("checkTokenValid", () => {
		it("should update the user state if token is valid", async () => {
			const mockUser: User = {
				id: "1",
				name: "Valid User",
				email: "valid@example.com",
				username: "validuser",
			} as User;

			const mockResponse = {
				data: {
					user: mockUser,
					message: "Token is valid",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().checkTokenValid("valid-token");

			expect(result).toEqual({
				user: mockUser,
				message: "Token is valid",
				variant: "default",
			});

			const state = store.getState();
			expect(state.user).toEqual(mockUser);
		});
	});

	describe("setUser", () => {
		it("should update the user state", () => {
			const mockUser: User = {
				id: "1",
				name: "Set User",
				email: "set@example.com",
				username: "setuser",
			} as User;

			store.getState().setUser(mockUser);

			const state = store.getState();
			expect(state.user).toEqual(mockUser);
		});

		it("should set the user state to null", () => {
			store.getState().setUser(null);

			const state = store.getState();
			expect(state.user).toBeNull();
		});
	});

	describe("persist middleware", () => {
		it("should persist the state to sessionStorage", () => {
			const mockUser: User = {
				id: "1",
				name: "Persisted User",
				email: "persisted@example.com",
				username: "persisteduser",
			} as User;

			store.setState({ user: mockUser });

			expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
				"auth-store",
				expect.stringContaining(JSON.stringify({ user: mockUser })),
			);
		});

		it("should hydrate the state from sessionStorage", () => {
			const mockUser: User = {
				id: "1",
				name: "Hydrated User",
				email: "hydrated@example.com",
				username: "hydrateduser",
			} as User;

			mockSessionStorage.getItem.mockReturnValue(
				JSON.stringify({ state: { user: mockUser } }),
			);

			const newStore = createAuthStore();
			const state = newStore.getState();

			expect(state.user).toEqual(mockUser);
		});
	});
});
