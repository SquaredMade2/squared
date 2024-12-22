import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const teamRouter = router({
	getUserTeams: privateProcedure
		.input(z.object({ userId: z.string(), workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { teamService } = ctx;
			const { userId, workspaceId } = input;
			return c.superjson(
				await teamService.getUserTeams(TODO, { userId, workspaceId }),
			);
		}),
});
