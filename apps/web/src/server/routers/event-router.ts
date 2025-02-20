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
	getNotifications: privateProcedure.query(async ({ c, ctx }) => {
		const { eventService, userId } = ctx;
		return c.superjson(
			await eventService.getNotifications(TODO, { userId: userId }),
		);
	}),
});
