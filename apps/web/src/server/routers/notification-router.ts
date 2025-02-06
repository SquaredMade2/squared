import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const notificationRouter = router({
	markAsUnread: privateProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { notificationIds } = input;
			return c.superjson(
				await eventService.toggleNotification(TODO, {
					notificationIds,
					read: true,
				}),
			);
		}),
	markAsRead: privateProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { notificationIds } = input;
			return c.superjson(
				await eventService.toggleNotification(TODO, {
					notificationIds,
					read: false,
				}),
			);
		}),
	dismiss: privateProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { notificationIds } = input;
			return c.superjson(
				await eventService.toggleNotification(TODO, {
					notificationIds,
					dismissed: true,
				}),
			);
		}),
	restore: privateProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { notificationIds } = input;
			return c.superjson(
				await eventService.toggleNotification(TODO, {
					notificationIds,
					dismissed: false,
				}),
			);
		}),
	delete: privateProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { notificationIds } = input;
			await eventService.deleteNotification(TODO, { notificationIds });
			return c.json({ success: true });
		}),
	updateUserNotifications: privateProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { userService, user } = ctx;
			const { notificationIds } = input;
			await userService.updateUserNotifications(TODO, {
				notificationIds,
				userId: user.id,
			});
			return c.json({ success: true });
		}),
	getNotifications: privateProcedure.query(async ({ c, ctx }) => {
		const { eventService, user } = ctx;
		return c.superjson(
			await eventService.getNotifications(TODO, {
				userId: user.id,
			}),
		);
	}),
});
