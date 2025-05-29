import { TODO } from "@squaredmade/context";
import { z } from "zod";
import { j, privateProcedure, workspaceProcedure } from "../jstack";

export const workspaceRouter = j.router({
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
	getWorkspaceLabels: workspaceProcedure.query(async ({ c, ctx }) => {
		const { workspaceService, workspaceId } = ctx;
		return c.superjson(
			await workspaceService.getWorkspaceLabels(TODO, {
				workspaceId,
			}),
		);
	}),
	removeUser: workspaceProcedure.mutation(async ({ c, ctx }) => {
		const { workspaceService, userId, workspaceId } = ctx;
		return c.json(
			await workspaceService.removeUserFromWorkspace(TODO, {
				workspaceId,
				userId,
			}),
		);
	}),
	inviteToWorkspace: workspaceProcedure
		.input(
			z.object({
				email: z.array(z.string()),
				workspaceSlug: z.string(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService, userId, workspaceId } = ctx;
			const { email, workspaceSlug: slug } = input;
			return c.json(
				await workspaceService.inviteToWorkspace(TODO, {
					workspaceId,
					email,
					userId,
					slug,
				}),
			);
		}),
	joinWorkspace: privateProcedure
		.input(
			z.object({
				token: z.string(),
				isLink: z.boolean(),
				workspace: z.object({
					id: z.string().optional(),
					name: z.string().optional(),
				}),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService, userId } = ctx;
			const { token, isLink, workspace } = input;
			return c.superjson(
				await workspaceService.joinWorkspace(TODO, {
					token,
					isLink,
					userId,
					workspace,
				}),
			);
		}),
	generateWorkspaceInviteLink: workspaceProcedure
		.input(
			z.object({
				expiration: z.string().optional(),
				uses: z.number().optional(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService, workspaceId } = ctx;
			const { expiration, uses } = input;
			return c.text(
				await workspaceService.generateWorkspaceInviteLink(TODO, {
					workspaceId,
					expiration,
					uses,
				}),
			);
		}),
	updateWorkspace: privateProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				workspace: z.object({
					name: z.string(),
					url: z.string(),
					defaultView: z.string().nullable(),
				}),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { workspaceId, workspace } = input;
			return c.superjson(
				await workspaceService.updateWorkspace(TODO, {
					workspaceId,
					workspace,
				}),
			);
		}),
	createWorkspaceLabel: workspaceProcedure
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
	deleteWorkspace: privateProcedure
		.input(z.object({ workspaceId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService } = ctx;
			const { workspaceId } = input;
			await workspaceService.deleteWorkspace(TODO, { workspaceId });
			return c.json({ success: true });
		}),
	updateWorkspaceLabel: workspaceProcedure
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
	deleteWorkspaceLabel: workspaceProcedure
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
	updateUserRole: workspaceProcedure
		.input(
			z.object({
				role: z.enum(["org:admin", "org:member", "org:owner"]),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { workspaceService, workspaceId, userId } = ctx;
			const { role } = input;
			await workspaceService.updateWorkspaceRole(TODO, {
				userId,
				workspaceId,
				role,
			});
			return c.json({ success: true });
		}),
});
