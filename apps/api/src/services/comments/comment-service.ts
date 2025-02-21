import { type Comment, type DBClient, commentsTable, eq } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { CommentRpc } from "./types";

export class CommentService implements CommentRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;

	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("comments");
	}
	async addComment(comment: Omit<Comment, "id" | "date">): Promise<Comment[]> {
		this.logger.info("Adding comment with payload", comment);
		return await this.db.insert(commentsTable).values(comment).returning();
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
