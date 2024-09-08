import type { Filter } from "@repo/db";
import { prisma } from "@/api";
import type { Prisma } from "@repo/db";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	filterId: string;
};

export function createRoute(): Route<Params> {
	return {
		// Create or update a filter
		POST: async (res, { filterId }, body): Promise<APIResponse<Filter>> => {
			try {
				// Ensure the user exists before creating the filter
				const existingUser = await prisma.user.findUnique({
					where: { id: body.userId },
				});

				if (!existingUser) {
					res.status(404);
					return {
						data: null,
						message: "Cannot find user",
						variant: "destructive",
					};
				}

				const { id, createdAt, updatedAt, conditions, ...rest } = body;

				// If `filterId` is provided, update the filter, otherwise create a new one
				const newFilter = await prisma.filter.upsert({
					where: { id: filterId || id }, // Upsert by filterId or provided id
					update: {
						...rest,
						conditions: conditions as Prisma.JsonValue, // Ensure conditions are JsonValue
					},
					create: {
						...rest,
						userId: body.userId,
						conditions: conditions as Prisma.JsonValue,
					},
				});

				if (!newFilter) {
					res.status(500);
					return {
						data: null,
						message: "Filter not created",
						variant: "destructive",
					};
				}

				// Return the created or updated filter
				return {
					data: newFilter,
					message: "Filter successfully created or updated",
					variant: "default",
				};
			} catch (error) {
				console.error("Error creating/updating filter:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		// Delete a filter
		DELETE: async (res, { filterId }): Promise<APIResponse<Filter>> => {
			try {
				// Ensure the filter exists before attempting to delete
				const filter = await prisma.filter.findUnique({
					where: { id: filterId },
				});

				if (!filter) {
					res.status(404);
					return {
						data: null,
						message: "Filter not found",
						variant: "destructive",
					};
				}

				// Delete the filter
				await prisma.filter.delete({
					where: { id: filterId },
				});

				// Return success message after deletion
				return {
					data: null,
					message: "Filter successfully deleted",
					variant: "default",
				};
			} catch (error) {
				console.error("Error deleting filter:", error);
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
