import type { CreateNotificationRequest } from "@/gen/rpc/event";
import { TODO } from "@squared/context";
import { NotificationType } from "@squared/db";
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
			const { userService, userId } = ctx;
			const { notificationIds } = input;
			await userService.updateUserNotifications(TODO, {
				notificationIds,
				userId: userId,
			});
			return c.json({ success: true });
		}),
	getNotifications: privateProcedure.query(async ({ c, ctx }) => {
		const { eventService, userId } = ctx;
		return c.superjson(
			await eventService.getNotifications(TODO, {
				userId: userId,
			}),
		);
	}),

	createMention: privateProcedure
		.input(
			z.object({
				description: z.string(),
				type: z.enum(Object.values(NotificationType) as [NotificationType]),
				taskId: z.string(),
				userId: z.string(),
				workspaceId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const newMention: CreateNotificationRequest = {
				...input,
			};
			const { eventService } = ctx;
			return c.superjson(
				await eventService.createNotification(TODO, newMention),
			);
		}),
});
