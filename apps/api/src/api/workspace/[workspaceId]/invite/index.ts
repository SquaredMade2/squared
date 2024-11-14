import { prisma } from "@/api";
import type { Route } from "@/api/route";
import { sendMail } from "@/utils/mail";
import { joinWorkspaceTemplate } from "@/utils/templates";
import createCustomLogger from "@squared/logger";
import jwt from "jsonwebtoken";

type Params = {
	workspaceId: string;
};

type InviteBody = {
	email: string | string[];
};

const JWT_SECRET = process.env.JWT_SECRET;
const logger = createCustomLogger("workspace");

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
				logger.info("Inviting user to workspace: %0", { email, workspaceId });

				// Check if the workspace exists
				const workspace = await prisma.workspace.findUnique({
					where: { id: workspaceId },
					include: {
						Users: {
							include: {
								user: true,
							},
						},
					},
				});

				const workspaceEmails = workspace?.Users.map((u) => u.user.email) ?? [];

				if (!workspace) {
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

				const emailsToSend = Array.isArray(email) ? email : [email];
				const existingUsers = await prisma.user.findMany({
					where: {
						email: {
							in: emailsToSend,
						},
					},
				});

				// Send email with the token
				for (const email of emailsToSend.filter(
					(email) => !workspaceEmails.includes(email),
				)) {
					const newUser = !existingUsers.some((u) => u.email === email);
					await sendMail({
						logger,
						email,
						subject: "Workspace Invitation",
						html: joinWorkspaceTemplate({
							username: existingUsers.find((u) => u.email === email)?.name,
							path: newUser
								? `register?token=${token}`
								: `login?token=${token}`,
							workspaceName: workspace.name,
						}),
					});
				}
				return {
					data: null,
					message: "Invitation sent successfully.",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error inviting user to workspace: %0", error);
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
