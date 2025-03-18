import type { CreateNotificationRequest } from "@/gen/rpc/event";
import { TODO } from "@squared/context";
import { NotificationType } from "@squared/db";
import { z } from "zod";
import { router } from "../__internals/router";
import { workspaceProcedure } from "../procedures";

export const notificationRouter = router({
	markAsUnread: workspaceProcedure
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
	markAsRead: workspaceProcedure
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
	dismiss: workspaceProcedure
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
	restore: workspaceProcedure
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
	delete: workspaceProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { eventService } = ctx;
			const { notificationIds } = input;
			await eventService.deleteNotification(TODO, { notificationIds });
			return c.json({ success: true });
		}),
	updateUserNotifications: workspaceProcedure
		.input(z.object({ notificationIds: z.array(z.string()) }))
		.mutation(async ({ c, ctx, input }) => {
			const { userService, userId } = ctx;
			const { notificationIds } = input;
			await userService.updateUserNotifications(TODO, {
				notificationIds,
				userId,
			});
			return c.json({ success: true });
		}),
	getNotifications: workspaceProcedure.query(async ({ c, ctx }) => {
		const { eventService, userId } = ctx;
		return c.superjson(
			await eventService.getNotifications(TODO, {
				userId,
			}),
		);
	}),

	createMention: workspaceProcedure
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
