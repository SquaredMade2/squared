import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const teamRouter = router({
	getUserTeams: privateProcedure.query(async ({ c, ctx }) => {
		const { teamService, userId, workspaceId } = ctx;
		return c.superjson(
			await teamService.getUserTeams(TODO, {
				userId,
				workspaceId,
			}),
		);
	}),
	getTeamByIdentifier: privateProcedure
		.input(z.object({ identifier: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { teamService, workspaceId } = ctx;
			const { identifier } = input;
			return c.superjson(
				await teamService.getTeamByIdentifier(TODO, {
					identifier,
					workspaceId,
				}),
			);
		}),
	createTeam: privateProcedure
		.input(
			z.object({
				name: z.string(),
				identifier: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { teamService, userId, workspaceId } = ctx;
			const { name, identifier } = input;
			return c.superjson(
				await teamService.createTeam(TODO, {
					name,
					identifier,
					workspaceId,
					userId,
				}),
			);
		}),
});
