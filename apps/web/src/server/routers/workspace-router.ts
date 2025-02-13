import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const workspaceRouter = router({
	getAllWorkspaces: privateProcedure.query(async ({ c, ctx }) => {
		const { workspaceService, user } = ctx;
		return c.superjson(
			await workspaceService.getUserWorkspaces(TODO, { userId: user.id }),
		);
	}),
	getTakenUrls: privateProcedure.query(async ({ c, ctx }) => {
		const { workspaceService } = ctx;
		return c.json(await workspaceService.getTakenWorkspaceUrls(TODO));
	}),
	getWorkspaceByUrl: privateProcedure
		.input(z.object({ workspaceUrl: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { workspaceUrl } = input;
			return c.superjson(
				await workspaceService.getWorkspaceByUrl(TODO, { url: workspaceUrl }),
			);
		}),
	createWorkspace: privateProcedure
		.input(z.object({ name: z.string(), url: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { name, url } = input;
			return c.superjson(
				await workspaceService.createWorkspace(TODO, {
					userId: ctx.user.id,
					workspace: { name, url },
				}),
			);
		}),
	removeUser: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService, user } = ctx;
			const { workspaceId } = input;
			return c.json(
				await workspaceService.removeUserFromWorkspace(TODO, {
					workspaceId,
					userId: user.id,
				}),
			);
		}),
	inviteToWorkspace: privateProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				email: z.array(z.string()),
				workspaceSlug: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService, user } = ctx;
			const { workspaceId, email, workspaceSlug: slug } = input;
			return c.json(
				await workspaceService.inviteToWorkspace(TODO, {
					workspaceId,
					email,
					userId: user.id,
					slug,
				}),
			);
		}),
});
