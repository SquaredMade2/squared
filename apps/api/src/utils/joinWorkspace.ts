import type { APIResponse } from "@/api/route";
import type { Workspace } from "@repo/db";
import jwt from "jsonwebtoken";
import { prisma } from "../api";

const JWT_SECRET = process.env.JWT_SECRET;

export const joinWorkspace = async (
	token: string,
	userId: string,
): Promise<APIResponse<Workspace> & { status: number }> => {
	if (!JWT_SECRET) {
		return {
			data: null,
			message: "JWT_SECRET is not defined.",
			variant: "destructive",
			status: 500,
		};
	}

	// Verify the token
	const decoded = jwt.verify(token, JWT_SECRET) as {
		workspaceId: string;
	};

	const workspace = await prisma.workspace.findUnique({
		where: { id: decoded.workspaceId },
		include: {
			Labels: true,
			Users: true,
		},
	});

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!workspace) {
		return {
			data: null,
			message: "Workspace not found.",
			variant: "destructive",
			status: 404,
		};
	}
	if (!user) {
		return {
			data: null,
			message: "User not found.",
			variant: "destructive",
			status: 404,
		};
	}

	// Check if user is already in the workspace
	const userAlreadyInWorkspace = workspace.Users.some(
		(workspaceUser) => workspaceUser.userId === userId,
	);

	if (userAlreadyInWorkspace) {
		return {
			data: workspace,
			message: "You're already a member of this workspace!",
			variant: "default",
			status: 200,
		};
	}

	// Add user to workspace
	await prisma.userWorkspace.create({
		data: {
			user: { connect: { id: userId } },
			workspace: { connect: { id: decoded.workspaceId } },
		},
	});

	// Fetch the updated workspace with user info
	const updatedWorkspace = await prisma.workspace.findUnique({
		where: { id: decoded.workspaceId },
		include: {
			Labels: true,
		},
	});

	if (user.onBoarding || !user.verified) {
		await prisma.user.update({
			where: { id: userId },
			data: { onBoarding: false, verified: true },
		});
	}
	return {
		data: updatedWorkspace,
		message: "User successfully joined the workspace.",
		variant: "default",
		status: 200,
	};
};
