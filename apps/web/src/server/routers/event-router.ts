import { TODO } from "@squaredmade/context";
import { z } from "zod";
import { j, workspaceProcedure } from "../jstack";

export const eventRouter = j.router({
	getEvents: workspaceProcedure
		.input(z.object({ taskId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { taskId } = input;
			return c.superjson(await eventService.getTaskEvents(TODO, { taskId }));
		}),
	getNotifications: workspaceProcedure.query(async ({ c, ctx }) => {
		const { eventService, userId } = ctx;
		return c.superjson(await eventService.getNotifications(TODO, { userId }));
	}),
});
