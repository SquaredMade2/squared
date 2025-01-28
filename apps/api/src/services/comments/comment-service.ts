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
	async addComment({
		comment,
	}: { comment: Omit<Comment, "id"> }): Promise<Comment[]> {
		this.logger.info("Adding comment with payload: %0", comment);
		const result = await this.db.transaction(async (tx) => {
			// Insert the new comment
			await tx.insert(commentsTable).values(comment);

			// Fetch all comments for the task, including the newly inserted one
			return tx
				.select()
				.from(commentsTable)
				.where(eq(commentsTable.taskId, comment.taskId))
				.orderBy(commentsTable.date);
		});

		return result;
	}
	async deleteComment({ commentId }: { commentId: string }): Promise<void> {
		this.logger.info("Deleting comment with id: %s", commentId);
		await this.db.delete(commentsTable).where(eq(commentsTable.id, commentId));
		return;
	}
	async getTaskComments({ taskId }: { taskId: string }): Promise<Comment[]> {
		this.logger.info("Getting comments for task with id: %s", taskId);
		return this.db
			.select()
			.from(commentsTable)
			.where(eq(commentsTable.taskId, taskId));
	}
}
