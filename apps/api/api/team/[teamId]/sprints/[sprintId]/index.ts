import type { Sprint } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	teamId: string;
	sprintId: string;
};

export function createRoute(): Route<Params> {
	return {
		POST: async (
			res,
			{ teamId, sprintId },
			body,
		): Promise<APIResponse<Sprint>> => {
			try {
				const existingSprint = await prisma.sprint.findUnique({
					where: { id: sprintId },
				});

				if (existingSprint) {
					return {
						data: null,
						message: "Sprint already exists",
						variant: "destructive",
					};
				}

				const { id, ...sprintData } = body;

				const team = await prisma.team.findUnique({
					where: { id: teamId },
				});

				if (!team) {
					throw new Error("Workspace not found");
				}

				const newSprint = await prisma.sprint.create({
					data: {
						...sprintData,
					},
				});

				if (!newSprint) {
					res.status(500);
					return {
						data: null,
						message: "Sprint not created",
						variant: "destructive",
					};
				}

				// Return the new sprint
				return {
					data: newSprint,
					message: `Successfully Created New Sprint: ${newSprint.name}`,
					variant: "default",
				};
			} catch (error) {
				console.error("Error creating sprint:", error);
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
