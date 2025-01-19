import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const teamRouter = router({
	getUserTeams: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { teamService } = ctx;
			const { workspaceId } = input;
			return c.superjson(
				await teamService.getUserTeams(TODO, {
					userId: ctx.user.id,
					workspaceId,
				}),
			);
		}),
	getTeamByIdentifier: privateProcedure
		.input(z.object({ identifier: z.string(), workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { teamService } = ctx;
			const { identifier, workspaceId } = input;
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
				workspaceId: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { teamService, user } = ctx;
			const { name, identifier, workspaceId } = input;
			return c.superjson(
				await teamService.createTeam(TODO, {
					name,
					identifier,
					workspaceId,
					userId: user.id,
				}),
			);
		}),
});
