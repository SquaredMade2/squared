import type { Sprint } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	teamId: string;
	sprintId: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		POST: async (res, { teamId }, body): Promise<APIResponse<Sprint>> => {
			try {
				logger.info("Creating sprint: %0", { teamId, body });
				const team = await prisma.team.findUnique({
					where: { id: teamId },
				});

				if (!team) {
					throw new Error("Team not found");
				}

				const { name, startDate, endDate, status } = body;

				const newSprint = await prisma.sprint.create({
					data: {
						name,
						startDate,
						endDate,
						status,
						teamId,
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

				return {
					data: newSprint,
					message: `Successfully Created New Sprint: ${newSprint.name}`,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error creating sprint: %0", error);
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
			{ teamId, sprintId },
			body: Partial<Sprint>,
		): Promise<APIResponse<Sprint>> => {
			try {
				logger.info("Updating sprint: %0", { teamId, sprintId, body });
				const sprint = await prisma.sprint.findUnique({
					where: { id: sprintId },
				});

				if (!sprint || sprint.teamId !== teamId) {
					res.status(404);
					return {
						data: null,
						message: "Sprint not found or doesn't belong to the team",
						variant: "destructive",
					};
				}

				const updatedSprint = await prisma.sprint.update({
					where: { id: sprintId },
					data: body,
				});

				return {
					data: updatedSprint,
					message: `Successfully updated sprint: ${updatedSprint.name}`,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error updating sprint: %0", error);
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
