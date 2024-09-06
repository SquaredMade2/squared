import type { Workspace } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	workspaceId: string;
};


export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<Workspace>> => {
			try {
				// Find workspace by workspace ID
				const idWorkspace = await prisma.workspace.findUnique({
					where: { id: workspaceId },
				});

				const urlWorkspace = await prisma.workspace.findUnique({
					where: { url: workspaceId },
				});

				const workspace = idWorkspace || urlWorkspace;

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
					variant: "default"
				};
			} catch (error) {
				console.error("Error finding workspace:", error);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		PUT: async (res, { workspaceId }, body): Promise<APIResponse<Workspace>> => {
			try {
				const workspace = await prisma.workspace.update({
					where: { id: workspaceId },
					data: body,
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
					variant: "default"
				};
			} catch (error) {
				console.error("Error updating workspace:", error);
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
				const existingWorkspace = await prisma.workspace.findUnique({
					where: { id: workspaceId },
				});

				if (existingWorkspace) {
					console.error("Workspace already exists");
					return {
						data: null,
						message: "Workspace already exists",
						variant: "destructive",
					};
				}

				const newWorkspace = await prisma.workspace.create({
					data: {
						...body.workspace,
						Users: {
							create: {
								userId: body.userId,
							},
						},
					},
				});

				if (!newWorkspace) {
					console.error("Workspace not created");
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
						identifier: newWorkspace.url.slice(0, 3),
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
				console.error("Error creating workspace:", error);
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
					data: workspace,
					message:"Workspace deleted",
					variant: "default"
				};
			} catch (error) {
				console.error("Error deleting workspace:", error);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
