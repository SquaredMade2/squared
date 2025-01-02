import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const commentRouter = router({
	getComments: privateProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { commentService } = ctx;
			const { taskId } = input;
			return c.superjson(
				await commentService.getTaskComments(TODO, { taskId }),
			);
		}),
});
