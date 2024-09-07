import type { User, Workspace } from "@repo/db";
import { prisma } from "@/api";
import jwt from "jsonwebtoken";
import type { Route, APIResponse } from "@/api/route";

type JoinBody = {
	token: string;
	user: User;
};

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route {
	return {
		POST: async (res, _, body: JoinBody): Promise<APIResponse<Workspace>> => {
			try {
				const { token, user } = body;

				if (!JWT_SECRET) {
					res.status(500);
					return {
						data: null,
						message: "JWT_SECRET is not defined.",
						variant: "destructive",
					};
				}

				// Verify the token
				const decoded = jwt.verify(token, JWT_SECRET) as {
					workspaceId: string;
				};

				const workspace = await prisma.workspace.findUnique({
					where: { id: decoded.workspaceId },
					include: { Users: true, teams: { include: { Tasks: true } } },
				});

				if (!workspace) {
					res.status(404);
					return {
						data: null,
						message: "Workspace not found.",
						variant: "destructive",
					};
				}

				// Check if user is already in the workspace
				const userAlreadyInWorkspace = workspace.Users.some(
					(workspaceUser) => workspaceUser.userId === user.id,
				);

				if (userAlreadyInWorkspace) {
					res.status(400);
					return {
						data: workspace,
						message: "You're already a member of this workspace!",
						variant: "destructive",
					};
				}

				// Add user to workspace
				await prisma.userWorkspace.create({
					data: {
						user: { connect: { id: user.id } },
						workspace: { connect: { id: decoded.workspaceId } },
					},
				});

				// Fetch the updated workspace with user info
				const updatedWorkspace = await prisma.workspace.findUnique({
					where: { id: decoded.workspaceId },
					include: { Users: true, teams: { include: { Tasks: true } } },
				});

				res.status(200);
				return {
					data: updatedWorkspace,
					message: "User successfully joined the workspace.",
					variant: "default",
				};
			} catch (error) {
				console.error("Error processing request:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error.",
					variant: "destructive",
				};
			}
		},
	};
}
