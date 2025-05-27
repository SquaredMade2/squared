import env from "@/env";
import { baseProcedure } from "@/middleware";
import { j } from "@/middleware";
import {
	expirationTimeFormat,
	generateSecureRandomString,
} from "@/utils/helpers";
import { createClerkClient } from "@clerk/backend";
import {
	type DBClient,
	type Workspace,
	type WorkspaceInviteLink,
	and,
	arrayContains,
	eq,
	sql,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squaredmade/db";
import type { Logger } from "@squaredmade/logger";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";

// Schema definitions for complex objects
const labelSchema = z.object({
	name: z.string(),
	color: z.string(),
	description: z.string().optional(),
});

const workspaceSchema = z.object({
	name: z.string(),
	url: z.string(),
	description: z.string().optional(),
});

export const workspaceService = j.router({
	createWorkspace: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				workspace: workspaceSchema,
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { userId, workspace } = input;
			const { db, logger } = ctx;

			if (!env.CLERK_SECRET) {
				throw new HTTPException(500, {
					message: "CLERK_SECRET is not defined.",
				});
			}

			const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET });

			logger.info(
				"Creating workspace for user %s and payload %o",
				userId,
				workspace,
			);

			const newWorkspace = await db.transaction(async (tx) => {
				const [existingWorkspace, [user]] = await Promise.all([
					tx
						.select()
						.from(workspacesTable)
						.where(eq(workspacesTable.url, workspace.url))
						.limit(1),
					tx
						.select({ externalId: usersTable.externalId })
						.from(usersTable)
						.where(eq(usersTable.externalId, userId))
						.limit(1),
				]);

				if (existingWorkspace.length > 0) {
					throw new HTTPException(400, { message: "Workspace already exists" });
				}

				if (!user) {
					throw new HTTPException(404, { message: "User not found" });
				}

				const organization = await clerkClient.organizations.createOrganization(
					{
						name: workspace.name,
						slug: workspace.url,
						createdBy: user.externalId,
					},
				);

				const [newWorkspace] = await tx
					.insert(workspacesTable)
					.values({
						...workspace,
						externalId: organization.id,
						admins: [userId],
					})
					.returning();

				if (!newWorkspace) {
					throw new HTTPException(500, { message: "Workspace not created" });
				}

				const [_, [newTeam]] = await Promise.all([
					tx.insert(userWorkspacesTable).values({
						userId: userId,
						workspaceId: newWorkspace.externalId,
					}),
					tx
						.insert(teamsTable)
						.values({
							workspaceId: newWorkspace.externalId,
							name: newWorkspace.name,
							identifier: newWorkspace.url.slice(0, 3).toUpperCase(),
						})
						.returning(),
				]);

				await tx.insert(userTeamsTable).values({
					userId: userId,
					teamId: newTeam.id,
				});

				return newWorkspace;
			});

			return c.superjson(newWorkspace);
		}),

	getWorkspace: baseProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { workspaceId } = input;
			const { db, logger } = ctx;
			logger.info("Getting workspace with id %s", workspaceId);

			const workspace = await db
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.externalId, workspaceId))
				.then((results) => results[0] || null);

			return c.superjson(workspace);
		}),

	getWorkspaceByUrl: baseProcedure
		.input(z.object({ url: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { url } = input;
			const { db, logger } = ctx;
			logger.info("Getting workspace with url %s", url);

			const workspace = await db
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.url, url))
				.then((results) => results[0] || null);

			return c.superjson(workspace);
		}),

	updateWorkspace: baseProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				workspace: workspaceSchema.partial(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId, workspace } = input;
			const { db, logger } = ctx;
			logger.info(
				"Updating workspace with id %s and payload %o",
				workspaceId,
				workspace,
			);

			const updatedWorkspace = await db
				.update(workspacesTable)
				.set(workspace)
				.where(eq(workspacesTable.externalId, workspaceId))
				.returning()
				.then((results) => results[0]);

			if (!updatedWorkspace) {
				throw new HTTPException(404, { message: "Workspace not found" });
			}

			return c.superjson(updatedWorkspace);
		}),

	deleteWorkspace: baseProcedure
		.input(z.object({ workspaceId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId } = input;
			const { db, logger } = ctx;

			if (!env.CLERK_SECRET) {
				throw new HTTPException(500, {
					message: "CLERK_SECRET is not defined.",
				});
			}

			const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET });

			logger.info("Deleting workspace with id %s", workspaceId);

			await db
				.delete(workspacesTable)
				.where(eq(workspacesTable.externalId, workspaceId));

			await clerkClient.organizations.deleteOrganization(workspaceId);

			return c.superjson({ success: true });
		}),

	getUserWorkspaces: baseProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { userId } = input;
			const { db, logger } = ctx;
			logger.info("Getting workspaces for user: ", userId);

			const workspaces = await db
				.select()
				.from(workspacesTable)
				.innerJoin(
					userWorkspacesTable,
					eq(userWorkspacesTable.workspaceId, workspacesTable.externalId),
				)
				.where(eq(userWorkspacesTable.userId, userId));

			return c.superjson(workspaces.map((workspace) => workspace.Workspace));
		}),

	updateWorkspaceRole: baseProcedure
		.input(
			z.object({
				userId: z.string(),
				workspaceId: z.string(),
				role: z.enum(["org:admin", "org:member", "org:owner"]),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { userId, workspaceId, role } = input;
			const { logger } = ctx;

			if (!env.CLERK_SECRET) {
				throw new HTTPException(500, {
					message: "CLERK_SECRET is not defined.",
				});
			}

			const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET });

			logger.info(
				"Updating workspace role with\n\tuserId:     %s\n\tworkspaceId: %s\n\trole:       %s",
				userId,
				workspaceId,
				role,
			);

			await clerkClient.organizations.updateOrganizationMembership({
				organizationId: workspaceId,
				userId,
				role,
			});

			return c.superjson({ success: true });
		}),

	joinWorkspace: baseProcedure
		.input(
			z.object({
				token: z.string().optional(),
				isLink: z.boolean(),
				userId: z.string(),
				workspace: z.object({
					id: z.string().optional(),
					name: z.string().optional(),
				}),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const {
				token,
				isLink,
				userId,
				workspace: { id: workspaceId, name: workspaceName },
			} = input;
			const { db, logger } = ctx;

			logger.info(
				`User attempting to join workspace ${workspaceId ? workspaceId : workspaceName}`,
			);

			try {
				if (isLink && token && workspaceName) {
					const { workspaceId, inviteLinks } = await verifyToken(
						db,
						logger,
						token,
						workspaceName,
					);

					const { workspace, isAlreadyJoined } = await addUserToWorkspace(
						db,
						userId,
						workspaceId,
					);

					if (inviteLinks && !isAlreadyJoined) {
						const inviteLink = inviteLinks.find((data) => data.link === token);

						if (inviteLink?.uses) {
							const filteredLinks = inviteLinks.filter(
								(data) => data.link !== token,
							);
							logger.info("Reducing InviteLink uses by 1");
							const inviteLinksUpdate = [
								...filteredLinks,
								{
									link: inviteLink.link,
									expiration: inviteLink.expiration,
									uses: inviteLink.uses - 1,
								},
							];
							await db
								.update(workspacesTable)
								.set({
									inviteLinks: inviteLinksUpdate,
								})
								.where(eq(workspacesTable.externalId, workspaceId));
						}
					}

					return c.superjson(workspace);
				}

				if (workspaceId) {
					const { workspace } = await addUserToWorkspace(
						db,
						userId,
						workspaceId,
					);
					return c.superjson(workspace);
				}

				return c.superjson(null);
			} catch (error) {
				logger.error(
					`Failed to join workspace. ${error instanceof Error && error.message}`,
				);
				throw error;
			}
		}),

	removeUserFromWorkspace: baseProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId, userId } = input;
			const { db, logger } = ctx;
			logger.info("Removing user from workspace");

			const result = await db.transaction(async (tx) => {
				const workspaceTeams = await tx
					.select()
					.from(teamsTable)
					.where(eq(teamsTable.workspaceId, workspaceId));

				if (workspaceTeams.length > 0) {
					for (const team of workspaceTeams) {
						const userTeam = await tx
							.select()
							.from(userTeamsTable)
							.where(
								and(
									eq(userTeamsTable.userId, userId),
									eq(userTeamsTable.teamId, team.id),
								),
							)
							.limit(1);

						if (userTeam.length > 0) {
							await tx
								.delete(userTeamsTable)
								.where(
									and(
										eq(userTeamsTable.userId, userId),
										eq(userTeamsTable.teamId, team.id),
									),
								);
						}
					}
				}

				await tx
					.delete(userWorkspacesTable)
					.where(
						and(
							eq(userWorkspacesTable.userId, userId),
							eq(userWorkspacesTable.workspaceId, workspaceId),
						),
					);

				return { success: true };
			});

			return c.superjson(result);
		}),

	inviteToWorkspace: baseProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				email: z.array(z.string()),
				userId: z.string(),
				slug: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId, email, userId, slug } = input;
			const { logger } = ctx;

			if (!env.CLERK_SECRET) {
				throw new HTTPException(500, {
					message: "CLERK_SECRET is not defined.",
				});
			}

			const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET });

			logger.info("Inviting user to workspace", {
				email,
				workspaceId,
			});

			const emails = Array.isArray(email) ? email : [email];
			const inviteUser = clerkClient.organizations.createOrganizationInvitation;

			await Promise.all(
				emails.map((e) =>
					inviteUser({
						organizationId: workspaceId,
						emailAddress: e,
						inviterUserId: userId,
						role: "member",
						redirectUrl: `${env.NEXT_PUBLIC_CONFIRM_URL}/${slug}/create`,
					}),
				),
			);

			return c.superjson({ success: true });
		}),

	getTakenWorkspaceUrls: baseProcedure.query(async ({ ctx, c }) => {
		const { db, logger } = ctx;
		logger.info("Getting taken workspace urls");

		const urls = await db
			.select({ url: workspacesTable.url })
			.from(workspacesTable)
			.then((results) => results.map((result) => result.url));

		return c.superjson(urls);
	}),

	generateWorkspaceInviteLink: baseProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				expiration: z.string().optional(),
				uses: z.number().optional(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId, expiration, uses } = input;
			const { db, logger } = ctx;
			logger.info(
				`Generating workspace invite link ${workspaceId} ${expiration} ${uses}`,
			);

			const link = generateSecureRandomString();

			await db.transaction(async (tx) => {
				const currentLinks = await tx
					.select({ inviteLinks: workspacesTable.inviteLinks })
					.from(workspacesTable)
					.where(eq(workspacesTable.externalId, workspaceId))
					.then((results) => results[0].inviteLinks);

				await tx
					.update(workspacesTable)
					.set({
						inviteLinks: [
							...currentLinks,
							{
								link,
								expiration: expiration
									? expirationTimeFormat(expiration)
									: undefined,
								uses,
							},
						],
					})
					.where(eq(workspacesTable.externalId, workspaceId));
			});

			return c.superjson(link);
		}),

	getWorkspaceLabels: baseProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { workspaceId } = input;
			const { db, logger } = ctx;
			logger.info("Getting labels for workspace with id %s", workspaceId);

			const labels = await db
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.externalId, workspaceId))
				.then((results) => results[0]?.labels || []);

			return c.superjson(labels);
		}),

	createWorkspaceLabel: baseProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				label: labelSchema,
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId, label } = input;
			const { db, logger } = ctx;
			logger.info("Creating label for workspace with id %s", workspaceId);

			const result = await db.transaction(async (tx) => {
				const workspace = await tx
					.select()
					.from(workspacesTable)
					.where(eq(workspacesTable.id, workspaceId))
					.limit(1)
					.then((results) => results[0]);

				if (!workspace) {
					throw new HTTPException(404, { message: "Workspace not found." });
				}

				const updated = await tx
					.update(workspacesTable)
					.set({
						labels: sql`COALESCE(${workspacesTable.labels}, '[]'::jsonb) || ${JSON.stringify(label)}::jsonb`,
					})
					.where(eq(workspacesTable.id, workspaceId))
					.returning({ labels: workspacesTable.labels })
					.then((res) => res[0]);

				if (!updated) {
					throw new HTTPException(500, { message: "Update failed." });
				}

				return { success: true, labels: updated.labels };
			});

			return c.superjson(result);
		}),

	updateWorkspaceLabel: baseProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				labelName: z.string(),
				updatedLabel: labelSchema.partial(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId, labelName, updatedLabel } = input;
			const { db, logger } = ctx;
			logger.info(
				"Editing label %s for workspace with id %s",
				labelName,
				workspaceId,
			);

			const result = await db.transaction(async (tx) => {
				const workspace = await tx
					.select()
					.from(workspacesTable)
					.where(eq(workspacesTable.id, workspaceId))
					.limit(1)
					.then((results) => results[0]);

				if (!workspace) {
					throw new HTTPException(404, { message: "Workspace not found." });
				}

				const labels = workspace.labels;
				const labelIndex = labels.findIndex((l) => l.name === labelName);
				if (labelIndex === -1) {
					throw new HTTPException(404, { message: "Label not found." });
				}

				const updatedLabels = [...labels];
				updatedLabels[labelIndex] = { ...labels[labelIndex], ...updatedLabel };

				const updated = await tx
					.update(workspacesTable)
					.set({ labels: updatedLabels })
					.where(eq(workspacesTable.id, workspaceId))
					.returning({ labels: workspacesTable.labels })
					.then((res) => res[0]);

				if (!updated) {
					throw new HTTPException(500, { message: "Update failed." });
				}

				return { success: true, labels: updated.labels };
			});

			return c.superjson(result);
		}),

	deleteWorkspaceLabel: baseProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				labelName: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { workspaceId, labelName } = input;
			const { db, logger } = ctx;
			logger.info(
				"Deleting label %s for workspace with id %s",
				labelName,
				workspaceId,
			);

			const result = await db.transaction(async (tx) => {
				const workspace = await tx
					.select()
					.from(workspacesTable)
					.where(eq(workspacesTable.id, workspaceId))
					.then((results) => results[0]);

				if (!workspace) {
					throw new HTTPException(404, { message: "Workspace not found." });
				}

				const updatedLabels = workspace.labels.filter(
					(label) => label.name !== labelName,
				);

				await tx
					.update(workspacesTable)
					.set({ labels: updatedLabels })
					.where(eq(workspacesTable.id, workspaceId));

				return { success: true };
			});

			return c.superjson(result);
		}),
});

// Helper functions moved outside the router
async function verifyToken(
	db: DBClient,
	logger: Logger,
	token: string,
	workspaceName: string,
): Promise<{
	inviteLinks?: WorkspaceInviteLink[];
	workspaceId: string;
}> {
	logger.info("Verifying token", { token, workspaceName });
	const [result] = await db
		.select({
			inviteLinks: workspacesTable.inviteLinks,
			workspaceId: workspacesTable.externalId,
		})
		.from(workspacesTable)
		.where(
			and(
				eq(workspacesTable.name, workspaceName),
				arrayContains(workspacesTable.inviteLinks, [{ link: token }]),
			),
		);

	if (!result) {
		throw new HTTPException(404, {
			message: "Invite Link is either no longer valid or does not exist",
		});
	}

	const { inviteLinks, workspaceId } = result;
	const inviteLink = inviteLinks.find((data) => data.link === token);

	if (!inviteLink) {
		throw new HTTPException(404, {
			message: "Invite Link is either no longer valid or does not exist",
		});
	}

	if (
		(inviteLink?.expiration && Date.now() > inviteLink.expiration) ||
		inviteLink?.uses === 0
	) {
		throw new HTTPException(400, {
			message: `Invite Link has ${inviteLink?.uses === 0 ? "run out of allotted uses" : "expired"}`,
		});
	}

	return { inviteLinks, workspaceId };
}

async function addUserToWorkspace(
	db: DBClient,
	userId: string,
	workspaceId: string,
): Promise<{ workspace: Workspace | null; isAlreadyJoined: boolean }> {
	let isAlreadyJoined = false;
	const [workspace] = await db.transaction(async (tx) => {
		const userWorkspaceRow = await tx
			.insert(userWorkspacesTable)
			.values({ userId, workspaceId })
			.onConflictDoNothing({
				target: [userWorkspacesTable.workspaceId, userWorkspacesTable.userId],
			})
			.returning();

		if (userWorkspaceRow.length === 0) {
			isAlreadyJoined = true;
		}

		return await tx
			.select()
			.from(workspacesTable)
			.where(eq(workspacesTable.externalId, workspaceId));
	});

	return { workspace, isAlreadyJoined };
}
