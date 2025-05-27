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
		return this.db
			.insert(commentsTable)
			.values(comment)
			.returning()
			.then((res) => {
				if (!res[0]) {
					this.logger.error(
						"Something went wrong while adding comment using:",
						comment,
					);
					throw new Error("Adding Comment Failed");
				}
				return res[0];
			});
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
	async getCommentById(commentId: string): Promise<Comment | null> {
		this.logger.info("Fetching comment with id", commentId);
		const result = await this.db
			.select()
			.from(commentsTable)
			.where(eq(commentsTable.id, commentId))
			.limit(1);
		return result[0] || null;
	}
}
