import { prisma } from "@/api";
import jwt from "jsonwebtoken";
import type { Route, APIResponse } from "@/api/route";
import { sendMail } from "@/utils/mail";

type Params = {
	workspaceId: string;
};

type InviteBody = {
	email: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export function createRoute(): Route<Params> {
	return {
		POST: async (
			res,
			{ workspaceId },
			body: InviteBody,
		): Promise<{
			data: null;
			message: string;
			variant: "destructive" | "default";
		}> => {
			try {
				const { email } = body;

				if (!JWT_SECRET) {
					res.status(500);
					return {
						data: null,
						message: "JWT_SECRET is not defined.",
						variant: "destructive",
					};
				}

				// Check if the workspace exists
				const workspace = await prisma.workspace.findUnique({
					where: { id: workspaceId },
				});

				if (!workspace) {
					res.status(404);
					return {
						data: null,
						message: "Workspace not found.",
						variant: "destructive",
					};
				}

				// Generate token
				const token = jwt.sign({ workspaceId, email }, JWT_SECRET, {
					expiresIn: "1h",
				});

				// Send email with the token
				await sendMail(
					email,
					"Workspace Invitation",
					token,
					"invite",
					`${workspace.url}/join`,
					workspace.name ?? "Squared Worspace",
				);

				res.status(200);
				return {
					data: null,
					message: "Invitation sent successfully.",
					variant: "default",
				};
			} catch (error) {
				console.error("Error inviting user to workspace:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error.",
					variant: "destructive",
				};
			}
		},
	};
}
