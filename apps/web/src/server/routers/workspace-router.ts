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
	getWorkspaceLabels: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { workspaceId } = input;
			return c.superjson(
				await workspaceService.getWorkspaceLabels(TODO, {
					workspaceId: workspaceId,
				}),
			);
		}),
	createWorkspaceLabel: privateProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				label: z.object({
					name: z.string(),
					description: z.string().nullable().optional(),
					color: z.string(),
				}),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceId, label } = input;
			const { workspaceService } = ctx;
			return c.superjson(
				await workspaceService.createWorkspaceLabel(TODO, {
					workspaceId,
					label,
				}),
			);
		}),
	updateWorkspaceLabel: privateProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				labelName: z.string(),
				updatedLabel: z.object({
					name: z.string(),
					description: z.string().nullable().optional(),
					color: z.string(),
				}),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceId, updatedLabel, labelName } = input;
			const { workspaceService } = ctx;
			return c.superjson(
				await workspaceService.updateWorkspaceLabel(TODO, {
					workspaceId,
					labelName,
					updatedLabel,
				}),
			);
		}),
	deleteWorkspaceLabel: privateProcedure
		.input(z.object({ workspaceId: z.string(), labelName: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceId, labelName } = input;
			const { workspaceService } = ctx;
			return c.superjson(
				await workspaceService.deleteWorkspaceLabel(TODO, {
					workspaceId,
					labelName,
				}),
			);
		}),
});
