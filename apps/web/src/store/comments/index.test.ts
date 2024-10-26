import { createCommentStore } from ".";
import axios from "axios";
import type { Comment } from "@squared/db";
import { STANDARD_COMMENT, STANDARD_COMMENT_2 } from "@/test/mocks";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

	describe("addComment", () => {
		it("should add a comment and update the state", async () => {
			const mockComment: Partial<Comment> = {
				comment: "Test comment",
				taskId: "task-1",
				authorId: "user-1",
			};

			const mockResponse = {
				data: {
					data: { id: "mocked-uuid", ...mockComment } as Comment,
					message: "Comment added successfully",
					variant: "default",
				},
			};

			mockedAxios.post.mockResolvedValue(mockResponse);

			const result = await store.getState().addComment(mockComment);

			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining("/api/comment"),
				mockComment,
			);

			expect(result).toEqual({
				comment: mockResponse.data.data,
				message: "Comment added successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.comments).toHaveLength(1);
			expect(state.comments[0]).toEqual(mockResponse.data.data);
		});

		it("should handle errors when adding a comment", async () => {
			const mockComment: Partial<Comment> = {
				comment: "Test comment",
				taskId: "task-1",
				authorId: "user-1",
			};

			mockedAxios.post.mockRejectedValue(new Error("Network error"));

			const result = await store.getState().addComment(mockComment);

			expect(result).toEqual({
				comment: null,
				message: "Network error",
				variant: "destructive",
			});

			const state = store.getState();
			expect(state.comments).toHaveLength(0);
		});
	});

	describe("updateComment", () => {
		it("should update a comment and update the state", async () => {
			store.setState({ comments: [STANDARD_COMMENT] });

			const updatedComment: Partial<Comment> = {
				comment: "Updated comment",
			};

			const mockResponse = {
				data: {
					data: { ...STANDARD_COMMENT, ...updatedComment },
					message: "Comment updated successfully",
					variant: "default",
				},
			};

			mockedAxios.put.mockResolvedValue(mockResponse);

			const result = await store
				.getState()
				.updateComment(STANDARD_COMMENT.id, updatedComment);

			expect(mockedAxios.put).toHaveBeenCalledWith(
				expect.stringContaining(`/api/comment/${STANDARD_COMMENT.id}`),
				updatedComment,
			);

			expect(result).toEqual({
				comment: mockResponse.data.data,
				message: "Comment updated successfully",
				variant: "default",
			});

			const state = store.getState();
			expect(state.comments).toHaveLength(1);
			expect(state.comments[0]).toEqual(mockResponse.data.data);
		});

		it("should handle errors when updating a comment", async () => {
			mockedAxios.put.mockRejectedValue(new Error("Network error"));

			const result = await store
				.getState()
				.updateComment("comment-1", { comment: "Updated comment" });

			expect(result).toEqual({
				comment: null,
				message: "Network error",
				variant: "destructive",
			});
		});
	});

	describe("deleteComment", () => {
		it("should delete a comment and update the state", async () => {
			store.setState({ comments: [STANDARD_COMMENT] });

			mockedAxios.delete.mockResolvedValue({});

			await store.getState().deleteComment(STANDARD_COMMENT.id);

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				expect.stringContaining(`/api/comment/${STANDARD_COMMENT.id}`),
			);

			const state = store.getState();
			expect(state.comments).toHaveLength(0);
		});

		it("should handle errors when deleting a comment", async () => {
			store.setState({ comments: [STANDARD_COMMENT] });

			mockedAxios.delete.mockRejectedValue(new Error("Network error"));

			await store.getState().deleteComment("comment-1");

			const state = store.getState();
			expect(state.comments).toHaveLength(1);
		});
	});

	describe("getComment", () => {
		it("should return an existing comment from the state", async () => {
			store.setState({ comments: [STANDARD_COMMENT] });

			const result = await store.getState().getComment(STANDARD_COMMENT.id);

			expect(result).toEqual({
				comment: STANDARD_COMMENT,
				message: "Comment found",
				variant: "default",
			});

			expect(mockedAxios.get).not.toHaveBeenCalled();
		});

		it("should fetch a comment from the API if not in state", async () => {
			const mockResponse = {
				data: {
					data: STANDARD_COMMENT,
					message: "Comment fetched successfully",
					variant: "default",
				},
			};

			mockedAxios.get.mockResolvedValue(mockResponse);

			const result = await store.getState().getComment("comment-1");

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining("/api/comment/comment-1"),
			);

			expect(result).toEqual({
				comment: STANDARD_COMMENT,
				message: "Comment fetched successfully",
				variant: "default",
			});
		});

		it("should handle errors when fetching a comment", async () => {
			mockedAxios.get.mockRejectedValue(new Error("Network error"));

			const result = await store.getState().getComment("comment-1");

			expect(result).toEqual({
				comment: null,
				message: "Network error",
				variant: "destructive",
			});
		});
	});

	describe("getAllComments", () => {
		it("should fetch all comments for a task and update the state", async () => {
			const mockComments: Comment[] = [STANDARD_COMMENT, STANDARD_COMMENT_2];

			mockedAxios.get.mockResolvedValue({ data: mockComments });

			const result = await store.getState().getAllComments("task-1");

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expect.stringContaining("/api/task/task-1/comment"),
			);

			expect(result).toEqual(mockComments);

			const state = store.getState();
			expect(state.comments).toEqual(mockComments);
		});

		it("should handle errors when fetching all comments", async () => {
			mockedAxios.get.mockRejectedValue(new Error("Network error"));

			const result = await store.getState().getAllComments("task-1");

			expect(result).toEqual([]);

			const state = store.getState();
			expect(state.comments).toEqual([]);
		});
	});
});
