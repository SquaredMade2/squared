import type { Label } from "@repo/db";
import { prisma } from "../../..";
import type { Route, APIResponse } from "../../../route";

type Params = {
	workspaceId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }, query): Promise<APIResponse<Label>> => {
			try {
				// Find labels by label ID
				const labels: Label[] | null = await prisma.label.findMany({
					where: { workspaceId },
				});

				if (!labels) {
					res.status(404);
					return {
						data: labels,
						message: "Teams not found",
						variant: "destructive",
					};
				}

				// Return the found labels
				return {
					data: labels,
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding labels:", error);
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
