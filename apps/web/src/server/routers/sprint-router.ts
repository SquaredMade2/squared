import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const sprintRouter = router({
	getSprints: privateProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { teamId } = input;
			return c.superjson(await sprintService.getSprints(TODO, { teamId }));
		}),
	getSprintTasks: privateProcedure
		.input(z.object({ sprintId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { sprintService } = ctx;
			const { sprintId } = input;
			return c.superjson(
				await sprintService.getSprintTasks(TODO, { sprintId }),
			);
		}),
});
