import {
	type Comment,
	type DBClient,
	commentsTable,
	eq,
} from "@squaredmade/db";
import type { Logger } from "@squaredmade/logger";
import createCustomLogger from "@squaredmade/logger";
import type { CommentRpc } from "./types";

export class CommentService implements CommentRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;

	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("comments");
	}
	async addComment(comment: Omit<Comment, "id" | "date">): Promise<Comment> {
		this.logger.info("Adding comment with payload", comment);
		const result = await this.db
			.insert(commentsTable)
			.values(comment)
			.returning();
		if (!result[0]) {
			this.logger.error("No comment returned from DB insertion", comment);
			throw new Error("No comment returned from DB insertion");
		}
		return result[0];
	}
	async deleteComment({ commentId }: { commentId: string }): Promise<void> {
		this.logger.info("Deleting comment with id", commentId);
		await this.db.delete(commentsTable).where(eq(commentsTable.id, commentId));
		return;
	}
	async getTaskComments({ taskId }: { taskId: string }): Promise<Comment[]> {
		this.logger.info("Getting comments for task with id", taskId);
		return this.db
			.select()
			.from(commentsTable)
			.where(eq(commentsTable.taskId, taskId));
	}
}
