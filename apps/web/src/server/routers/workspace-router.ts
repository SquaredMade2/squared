import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const workspaceRouter = router({
	getAllWorkspaces: privateProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { userId } = input;
			return c.json(await workspaceService.getUserWorkspaces(TODO, { userId }));
		}),
});
