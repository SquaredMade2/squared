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
		const { userService, user } = ctx;
		return c.json(
			await userService.getDefaultWorkspace(TODO, { userId: user.id }),
		);
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
			const { userService, user } = ctx;
			const { teamIdentifier } = input;
			return c.json(
				await userService.isUserAuthorized(TODO, {
					userId: user.id,
					teamIdentifier,
				}),
			);
		}),
	getUserWorkspaceRole: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService, user } = ctx;
			const { workspaceId } = input;
			const role = await userService.getUserWorkspaceRole(TODO, {
				userId: user.id,
				workspaceId,
			});
			return c.text(role);
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
			const { userService, user } = ctx;
			const { userId, workspaceId, newRole } = input;

			return c.json(
				await userService.updateUsersRole(TODO, {
					callerId: user.id,
					userId,
					workspaceId,
					newRole,
				}),
			);
		}),
});
