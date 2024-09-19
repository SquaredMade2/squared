import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
};

type UserAvatar = {
	id: string;
	name: string;
	avatarUrl: string | null;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<UserAvatar[]>> => {
			try {
				// Step 1: Get the workspaces the user belongs to
				const userWorkspaces = await prisma.userWorkspace.findMany({
					where: { userId },
					select: {
						workspaceId: true,
					},
				});

				// If the user is not in any workspace, return an empty result
				if (userWorkspaces.length === 0) {
					return {
						data: null,
						message: "User is not part of any workspace",
						variant: "default",
					};
				}

				// Extract workspace IDs
				const workspaceIds = userWorkspaces.map((uw) => uw.workspaceId);

				// Step 2: Get all users in the same workspaces
				const usersInWorkspaces: UserAvatar[] = await prisma.user.findMany({
					where: {
						Workspaces: {
							some: {
								workspaceId: {
									in: workspaceIds,
								},
							},
						},
					},
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				});

				// Return the formatted result
				return {
					data: usersInWorkspaces,
					variant: "default",
				};
			} catch (err) {
				console.error("Error fetching users in the same workspaces:", err);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
	};
}
