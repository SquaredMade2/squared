import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";

export const workspaceRouter = router({
	getAllWorkspaces: privateProcedure.query(async ({ c, ctx }) => {
		const { workspaceService, userId } = ctx;
		return c.superjson(
			await workspaceService.getUserWorkspaces(TODO, { userId }),
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
			const { workspaceService, userId } = ctx;
			const { name, url } = input;
			return c.superjson(
				await workspaceService.createWorkspace(TODO, {
					userId,
					workspace: { name, url },
				}),
			);
		}),
	getWorkspaceLabels: privateProcedure.query(async ({ c, ctx }) => {
		const { workspaceService, workspaceId } = ctx;
		return c.superjson(
			await workspaceService.getWorkspaceLabels(TODO, {
				workspaceId,
			}),
		);
	}),
	createWorkspaceLabel: privateProcedure
		.input(
			z.object({
				label: z.object({
					name: z.string(),
					description: z.string().nullable().optional(),
					color: z.string(),
				}),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { label } = input;
			const { workspaceId, workspaceService } = ctx;
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
				labelName: z.string(),
				updatedLabel: z.object({
					name: z.string(),
					description: z.string().nullable().optional(),
					color: z.string(),
				}),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { updatedLabel, labelName } = input;
			const { workspaceId, workspaceService } = ctx;
			return c.superjson(
				await workspaceService.updateWorkspaceLabel(TODO, {
					workspaceId,
					labelName,
					updatedLabel,
				}),
			);
		}),
	deleteWorkspaceLabel: privateProcedure
		.input(z.object({ labelName: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { labelName } = input;
			const { workspaceId, workspaceService } = ctx;
			return c.superjson(
				await workspaceService.deleteWorkspaceLabel(TODO, {
					workspaceId,
					labelName,
				}),
			);
		}),
});
