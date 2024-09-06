import type { Workspace } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	workspaceId: string;
};

interface WorkspaceResponse {
	workspace: Workspace | null;
	message?: string;
	variant: "default" | "destructive";
}

export function createRoute(): Route<Params> {
	return {
		GET: async ({ workspaceId }) => {
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
					throw new Error("Workspace not found");
				}

				// Return the found workspace
				return workspace;
			} catch (error) {
				console.error("Error finding workspace:", error);
				throw new Error("Internal server error");
			}
		},
		PUT: async ({ workspaceId }, body) => {
			try {
				const workspace = await prisma.workspace.update({
					where: { id: workspaceId },
					data: body,
				});
				if (!workspace) {
					throw new Error("Workspace not found");
				}

				// Return the updated workspace
				return workspace;
			} catch (error) {
				console.error("Error updating workspace:", error);
				throw new Error("Internal server error");
			}
		},
		POST: async (
			{ workspaceId },
			body: { workspace: Workspace; userId: string },
		): Promise<WorkspaceResponse> => {
			try {
				const existingWorkspace = await prisma.workspace.findFirst({
					where: {
						OR: [
						{ id: workspaceId },
						{ url: body.workspace.url },
						],
					},
				});

				if (existingWorkspace) {
					console.error("Workspace already exists");
					return {
						workspace: null,
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
						workspace: null,
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
					workspace: newWorkspace,
					variant: "default",
					message: "Workspace created successfully",
				};
			} catch (error) {
				console.error("Error creating workspace:", error);
				return {
					workspace: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		DELETE: async ({ workspaceId }) => {
			try {
				const workspace = await prisma.workspace.delete({
					where: { id: workspaceId },
				});
				if (!workspace) {
					throw new Error("Workspace not found");
				}

				// Return success message
				return { message: "Workspace deleted" };
			} catch (error) {
				console.error("Error deleting workspace:", error);
				throw new Error("Internal server error");
			}
		},
	};
}
