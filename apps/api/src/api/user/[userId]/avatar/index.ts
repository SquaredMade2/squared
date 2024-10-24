import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	userId: string;
};

type UserAvatar = {
	id: string;
	name: string;
	avatarUrl: string | null;
};
const logger = createCustomLogger("user");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<UserAvatar[]>> => {
			try {
				// Step 1: Get the workspaces the user belongs to
				logger.info("Fetching workspaces for user: %s", userId);
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
				logger.error("Error fetching users in the same workspaces: %0", err);
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
