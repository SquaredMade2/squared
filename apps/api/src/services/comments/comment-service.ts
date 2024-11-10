import type { Comment, PrismaClient } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { CommentRpc } from "./types";

export class CommentService implements CommentRpc {
	private readonly db: PrismaClient;
	private readonly logger: Logger;

	constructor(db: PrismaClient) {
		this.db = db;
		this.logger = createCustomLogger("comments");
	}
	async addComment({
		comment,
	}: { comment: Omit<Comment, "id"> }): Promise<Comment[]> {
		this.logger.info("Adding comment with payload: %0", comment);
		await this.db.comment.create({
			data: comment,
		});
		return this.db.comment.findMany({
			where: { taskId: comment.taskId },
		});
	}
	async deleteComment({ commentId }: { commentId: string }): Promise<void> {
		this.logger.info("Deleting comment with id: %s", commentId);
		await this.db.comment.delete({
			where: { id: commentId },
		});
		return;
	}
	async getTaskComments({ taskId }: { taskId: string }): Promise<Comment[]> {
		this.logger.info("Getting comments for task with id: %s", taskId);
		return this.db.comment.findMany({
			where: { taskId },
		});
	}
}
