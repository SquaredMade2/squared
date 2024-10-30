import type { Label } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	workspaceId: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<Label>> => {
			try {
				// Find labels by workspace ID
				logger.info("Finding labels by workspace ID: %s", workspaceId);
				const labels: Label[] = await prisma.label.findMany({
					where: { workspaceId },
				});

				if (labels.length === 0) {
					return {
						data: null,
						message: "Labels not found",
						variant: "destructive",
					};
				}

				// Return the found labels
				return {
					data: labels,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding labels: %0", error);
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
