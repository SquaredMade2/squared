import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const userRouter = router({
	getAllUsers: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService } = ctx;
			const { workspaceId } = input;
			return c.superjson(
				await userService.getWorkspaceUsers(TODO, { workspaceId }),
			);
		}),
	getTeamUsers: privateProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService } = ctx;
			const { teamId } = input;
			return c.superjson(await userService.getTeamUsers(TODO, { teamId }));
		}),
	getUser: privateProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService } = ctx;
			const { userId } = input;
			return c.superjson(await userService.getUser(TODO, { userId }));
		}),
	getDefaultWorkpace: privateProcedure.query(async ({ c, ctx }) => {
		const { userService, userId } = ctx;
		return c.json(await userService.getDefaultWorkspace(TODO, { userId }));
	}),
	onBoardUser: privateProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { userService } = ctx;
			const { userId } = input;
			return c.superjson(await userService.onBoardUser(TODO, { userId }));
		}),
	isUserAuthorized: privateProcedure
		.input(z.object({ teamIdentifier: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService, userId } = ctx;
			const { teamIdentifier } = input;
			return c.json(
				await userService.isUserAuthorized(TODO, {
					userId,
					teamIdentifier,
				}),
			);
		}),
	getUserWorkspaceRole: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService, userId } = ctx;
			const { workspaceId } = input;
			const roleData = await userService.getUserWorkspaceRole(TODO, {
				userId,
				workspaceId,
			});
			return c.json(roleData);
		}),

	updateUsersRole: privateProcedure
		.input(
			z.object({
				userId: z.string(),
				workspaceId: z.string(),
				newRole: z.enum(["owner", "admin", "member"]),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { userService, userId } = ctx;
			const { workspaceId, newRole } = input;

			return c.json(
				await userService.updateUsersRole(TODO, {
					callerId: userId,
					userId,
					workspaceId,
					newRole,
				}),
			);
		}),
	getWorkspaceUsersWithRoles: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService } = ctx;
			const { workspaceId } = input;
			return c.superjson(
				await userService.getWorkspaceUsersWithRoles(TODO, {
					workspaceId,
				}),
			);
		}),
	getWorkspaceAvatars: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService } = ctx;
			const { workspaceId } = input;
			return c.json(await userService.getUserAvatars(TODO, { workspaceId }));
		}),
	setLastViewedTask: privateProcedure
		.input(z.object({ taskId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { userService, userId } = ctx;
			const { taskId } = input;

			await userService.setLastViewedTask(TODO, { userId, taskId });

			return c.json({ success: true });
		}),
});
