import { TODO } from "@squaredmade/context";
import { z } from "zod";
import { j, privateProcedure, workspaceProcedure } from "../jstack";

export const userRouter = j.router({
	getAllUsers: workspaceProcedure.query(async ({ c, ctx }) => {
		const { userService, workspaceId } = ctx;
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
	getUser: privateProcedure.query(async ({ c, ctx }) => {
		const { userService, userId } = ctx;
		return c.superjson(await userService.getUser(TODO, { userId }));
	}),
	getDefaultWorkpace: privateProcedure.query(async ({ c, ctx }) => {
		const { userService, userId } = ctx;
		return c.json(await userService.getDefaultWorkspace(TODO, { userId }));
	}),
	onBoardUser: privateProcedure.mutation(async ({ c, ctx }) => {
		const { userService, userId } = ctx;
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
	getWorkspaceAvatars: workspaceProcedure.query(async ({ c, ctx }) => {
		const { userService, workspaceId } = ctx;
		return c.json(await userService.getUserAvatars(TODO, { workspaceId }));
	}),
	deleteUser: privateProcedure.mutation(async ({ c, ctx }) => {
		const { userService, userId } = ctx;

		await userService.deleteUser(TODO, { userId });

		return c.status(204);
	}),
});
