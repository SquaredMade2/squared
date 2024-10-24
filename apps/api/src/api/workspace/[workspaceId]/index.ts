import type { Workspace } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	workspaceId: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<Workspace>> => {
			try {
				// Find workspace by workspace ID
				const workspace = await prisma.workspace.findFirst({
					where: {
						OR: [{ id: workspaceId }, { url: workspaceId }],
					},
					include: {
						Labels: true,
					},
				});

				if (!workspace) {
					return {
						data: null,
						message: "Workspace not found",
						variant: "destructive",
					};
				}

				// Return the found workspace
				return {
					data: workspace,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding workspace: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		PUT: async (
			res,
			{ workspaceId },
			body,
		): Promise<APIResponse<Workspace>> => {
			try {
				const workspace = await prisma.workspace.update({
					where: { id: workspaceId },
					data: body,
					include: {
						Labels: true,
					},
				});
				if (!workspace) {
					return {
						data: null,
						message: "Workspace not found",
						variant: "destructive",
					};
				}

				// Return the updated workspace
				return {
					data: workspace,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error updating workspace: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		POST: async (
			res,
			{ workspaceId },
			body: { workspace: Workspace; userId: string },
		): Promise<APIResponse<Workspace>> => {
			try {
				const existingWorkspace = await prisma.workspace.findFirst({
					where: {
						OR: [{ id: workspaceId }, { url: body.workspace.url }],
					},
				});

				if (existingWorkspace) {
					logger.error("Workspace already exists");
					return {
						data: null,
						message: "Workspace already exists",
						variant: "destructive",
					};
				}

				const defaultLabels = [
					{ name: "Feature", description: "New feature", color: "#FF5733" },
					{ name: "Bug", description: "Bug fix", color: "#C70039" },
					{ name: "Chore", description: "General task", color: "#900C3F" },
					{ name: "Refactor", description: "Code refactor", color: "#581845" },
					{ name: "Docs", description: "Documentation", color: "#FFC300" },
					{ name: "Test", description: "Testing task", color: "#DAF7A6" },
					{
						name: "Design",
						description: "Design related task",
						color: "#33FFBD",
					},
				];

				const newWorkspace = await prisma.workspace.create({
					data: {
						...body.workspace,
						admins: [body.userId],
						Users: {
							create: {
								userId: body.userId,
							},
						},
						Labels: {
							create: defaultLabels.map((label) => ({
								name: label.name,
								description: label.description,
								color: label.color,
							})),
						},
					},
					include: {
						Labels: true,
					},
				});

				if (!newWorkspace) {
					logger.error("Workspace not created");
					res.status(500);
					return {
						data: null,
						message: "Workspace not created",
						variant: "destructive",
					};
				}

				await prisma.team.create({
					data: {
						workspaceId: newWorkspace.id,
						name: newWorkspace.name,
						identifier: newWorkspace.url.slice(0, 3).toUpperCase(),
						Users: {
							create: {
								userId: body.userId,
							},
						},
					},
				});

				// Return the new workspace
				return {
					data: newWorkspace,
					variant: "default",
					message: "Workspace created successfully",
				};
			} catch (error) {
				logger.error("Error creating workspace: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		DELETE: async (res, { workspaceId }): Promise<APIResponse<Workspace>> => {
			try {
				const workspace = await prisma.workspace.delete({
					where: { id: workspaceId },
				});
				if (!workspace) {
					return {
						data: null,
						message: "Workspace not found",
						variant: "destructive",
					};
				}

				// Return success message
				return {
					data: null,
					message: "Workspace deleted",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error deleting workspace: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
