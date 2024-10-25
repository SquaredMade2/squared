import type { RetrospectiveItem } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	sprintId: string;
};

type RetrospectiveData = {
	wentWell: RetrospectiveItem[];
	toImprove: RetrospectiveItem[];
	actionItems: RetrospectiveItem[];
};

const logger = createCustomLogger("sprints");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { sprintId }): Promise<APIResponse<RetrospectiveData>> => {
			try {
				logger.info("Fetching retrospective data for sprin: %s", sprintId);
				const sprint = await prisma.sprint.findUnique({
					where: { id: sprintId },
					include: {
						wentWell: true,
						toImprove: true,
						actionItems: true,
					},
				});

				if (!sprint) {
					res.status(404);
					return {
						data: null,
						message: "Sprint not found",
						variant: "destructive",
					};
				}

				return {
					data: {
						wentWell: sprint.wentWell,
						toImprove: sprint.toImprove,
						actionItems: sprint.actionItems,
					},
					message: "Retrospective data retrieved successfully",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error fetching retrospective data: %0", error);
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
			{ sprintId },
			body: { type: keyof RetrospectiveData; content: string },
		): Promise<APIResponse<RetrospectiveItem>> => {
			try {
				logger.info("Adding retrospective item for sprint: %s", sprintId);
				const { type, content } = body;
				const newItem = await prisma.retrospectiveItem.create({
					data: {
						content,
						type,
						[type === "wentWell"
							? "wentWellSprint"
							: type === "toImprove"
								? "toImproveSprint"
								: "actionItemsSprint"]: {
							connect: { id: sprintId },
						},
					},
				});

				return {
					data: newItem,
					message: "Retrospective item added successfully",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error adding retrospective item: %0", error);
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
			{ sprintId },
			body: { itemId: string; type: keyof RetrospectiveData },
		): Promise<APIResponse<RetrospectiveItem>> => {
			try {
				logger.info("Updating retrospective item for sprint: %s", sprintId);
				const { itemId, type } = body;
				if (!itemId) {
					res.status(400);
					return {
						data: null,
						message: "Item ID is required",
						variant: "destructive",
					};
				}
				if (!["wentWell", "toImprove", "actionItems"].includes(type)) {
					res.status(400);
					return {
						data: null,
						message: "Invalid item type",
						variant: "destructive",
					};
				}
				const updatedItem = await prisma.retrospectiveItem.update({
					where: { id: itemId },
					data: {
						type,
						wentWellSprintId: type === "wentWell" ? sprintId : null,
						toImproveSprintId: type === "toImprove" ? sprintId : null,
						actionItemsSprintId: type === "actionItems" ? sprintId : null,
					},
				});

				return {
					data: updatedItem,
					message: "Retrospective item updated successfully",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error updating retrospective item:", error);
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
