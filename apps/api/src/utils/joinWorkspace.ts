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

	const existingUserWorkspace = await prisma.userWorkspace.findFirst({
		where: {
			userId,
			workspaceId: decoded.workspaceId,
		},
	});

	const workspace = await prisma.workspace.findUnique({
		where: { id: decoded.workspaceId },
		include: {
			Labels: true,
		},
	});

	if (existingUserWorkspace) {
		return {
			data: workspace,
			message: "You're already a member of this workspace!",
			variant: "default",
			status: 200,
		};
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});
	const teams = await prisma.team.findMany({
		where: {
			workspaceId: decoded.workspaceId,
		},
	});

	if (!workspace) {
		return {
			data: null,
			message: "Workspace not found.",
			variant: "destructive",
			status: 404,
		};
	}
	if (teams.length === 0) {
		return {
			data: null,
			message: "No teams found in this workspace.",
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

	try {
		await Promise.all([
			prisma.userWorkspace.create({
				data: {
					user: { connect: { id: userId } },
					workspace: { connect: { id: decoded.workspaceId } },
				},
			}),
			prisma.userTeam.createMany({
				data: teams.map((team) => ({
					userId,
					teamId: team.id,
				})),
			}),
		]);
	} catch (error) {
		return {
			data: null,
			message:
				error instanceof Error ? error.message : "Failed to join workspace.",
			variant: "destructive",
			status: 500,
		};
	}

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
