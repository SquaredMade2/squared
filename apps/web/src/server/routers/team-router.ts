import { TODO } from "@squaredmade/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { workspaceProcedure } from "../procedures";

const effortEnum = z.enum(["LINEAR", "EXPONENTIAL", "FIBONACCI"]);

export const teamRouter = router({
	getUserTeams: workspaceProcedure.query(async ({ c, ctx }) => {
		const { teamService, userId, workspaceId } = ctx;
		return c.superjson(
			await teamService.getUserTeams(TODO, {
				userId,
				workspaceId,
			}),
		);
	}),
	getTeamByIdentifier: workspaceProcedure
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
	createTeam: workspaceProcedure
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
	removeUser: workspaceProcedure
		.input(z.object({ teamId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { teamService, userId } = ctx;
			const { teamId } = input;
			return c.superjson(
				await teamService.removeUserFromTeam(TODO, { teamId, userId }),
			);
		}),
	updateTeam: workspaceProcedure
		.input(
			z.object({
				teamId: z.string(),
				name: z.string(),
				identifier: z.string(),
				effort: effortEnum,
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { teamService } = ctx;
			const { teamId, name, identifier, effort } = input;
			return c.superjson(
				await teamService.updateTeam(TODO, {
					id: teamId,
					name,
					identifier,
					effort,
				}),
			);
		}),
	deleteTeam: workspaceProcedure
		.input(z.object({ teamId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { teamService } = ctx;
			const { teamId } = input;
			return c.superjson(await teamService.deleteTeam(TODO, { teamId }));
		}),
});
