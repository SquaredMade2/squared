import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const eventRouter = router({
	getEvents: privateProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { taskId } = input;
			return c.superjson(await eventService.getTaskEvents(TODO, { taskId }));
		}),
});
