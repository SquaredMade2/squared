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
	joinWorkspace: privateProcedure
		.input(
			z.object({
				token: z.string(),
				isLink: z.boolean(),
				userId: z.string(),
				workspaceName: z.string().optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { token, isLink, userId, workspaceName } = input;
			return c.superjson(
				await workspaceService.joinWorkspace(TODO, {
					token,
					isLink,
					userId,
					workspaceName,
				}),
			);
		}),
	generateWorkspaceInviteLink: privateProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				expiration: z.string().optional(),
				uses: z.number().optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { workspaceId, expiration, uses } = input;
			return c.text(
				await workspaceService.generateWorkspaceInviteLink(TODO, {
					workspaceId,
					expiration,
					uses,
				}),
			);
		}),
});
