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
	getWorkspaceAvatars: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { userService } = ctx;
			const { workspaceId } = input;
			return c.json(await userService.getUserAvatars(TODO, { workspaceId }));
		}),
});
