import { sendMail } from "@/utils/mail";
import { joinWorkspaceTemplate } from "@/utils/templates";
import { type ClerkClient, createClerkClient } from "@clerk/backend";
import {
	type DBClient,
	type Label,
	type Workspace,
	and,
	eq,
	inArray,
	sql,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import jwt from "jsonwebtoken";
import type {
	CreateWorkspaceParams,
	WorkspaceParams,
	WorkspaceRpc,
} from "./types";

const DEFAULT_LABELS = [
	{ name: "Feature", description: "New feature", color: "#FF5733" },
	{ name: "Bug", description: "Bug fix", color: "#C70039" },
	{ name: "Chore", description: "General task", color: "#900C3F" },
	{ name: "Refactor", description: "Code refactor", color: "#581845" },
	{ name: "Docs", description: "Documentation", color: "#FFC300" },
	{ name: "Test", description: "Testing task", color: "#DAF7A6" },
	{
		name: "Design",
		description: "Design related task",
		color: "#33FFBD",
	},
];

export class WorkspaceService implements WorkspaceRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;
	private readonly JWT_SECRET: string;
	private readonly clerkClient: ClerkClient;

	constructor(db: DBClient, JWT_SECRET?: string, CLERK_SECRET?: string) {
		this.db = db;
		this.logger = createCustomLogger("workspace");
		if (!JWT_SECRET) this.throwError("JWT_SECRET is not defined.");
		if (!CLERK_SECRET) this.throwError("CLERK_SECRET is not defined.");
		this.JWT_SECRET = JWT_SECRET;
		this.clerkClient = createClerkClient({ secretKey: CLERK_SECRET });
	}

	async createWorkspace({
		userId,
		workspace,
	}: CreateWorkspaceParams): Promise<Workspace> {
		this.logger.info(
			"Creating workspace for user %s and payload %o",
			userId,
			workspace,
		);

		return await this.db.transaction(async (tx) => {
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
				throw new Error("Workspace already exists");
			}
			const organization =
				await this.clerkClient.organizations.createOrganization({
					name: workspace.name,
					slug: workspace.url,
					createdBy: user.externalId,
				});

			const [newWorkspace] = await tx
				.insert(workspacesTable)
				.values({
					...workspace,
					externalId: organization.id,
					labels: DEFAULT_LABELS,
					admins: [userId],
				})
				.returning();

			if (!newWorkspace) {
				throw new Error("Workspace not created");
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
	}

	async getWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<Workspace | null> {
		this.logger.info("Getting workspace with id %s", workspaceId);
		return await this.db
			.select()
			.from(workspacesTable)
			.where(eq(workspacesTable.externalId, workspaceId))
			.then((results) => results[0]);
	}

	async getWorkspaceByUrl({ url }: { url: string }): Promise<Workspace | null> {
		this.logger.info("Getting workspace with url %s", url);
		return await this.db
			.select()
			.from(workspacesTable)
			.where(eq(workspacesTable.url, url))
			.then((results) => results[0]);
	}

	async updateWorkspace({
		workspaceId,
		workspace,
	}: {
		workspaceId: string;
		workspace: WorkspaceParams;
	}): Promise<Workspace> {
		this.logger.info(
			"Updating workspace with id %s and payload %o",
			workspaceId,
			workspace,
		);

		return await this.db
			.update(workspacesTable)
			.set(workspace)
			.where(eq(workspacesTable.externalId, workspaceId))
			.returning()
			.then((results) => results[0]);
	}

	async deleteWorkspace({
		workspaceId,
	}: { workspaceId: string }): Promise<void> {
		this.logger.info("Deleting workspace with id %s", workspaceId);

		await this.db
			.delete(workspacesTable)
			.where(eq(workspacesTable.externalId, workspaceId));
	}

	async getUserWorkspaces({
		userId,
	}: { userId: string }): Promise<Workspace[]> {
		this.logger.info("Getting workspaces for user: ", userId);
		const workspaces = await this.db
			.select()
			.from(workspacesTable)
			.innerJoin(
				userWorkspacesTable,
				eq(userWorkspacesTable.workspaceId, workspacesTable.externalId),
			)
			.where(eq(userWorkspacesTable.userId, userId));

		return workspaces.map((workspace) => workspace.Workspace);
	}

	async updateWorkspaceRole({
		userId,
		workspaceId,
		role,
	}: {
		userId: string;
		workspaceId: string;
		role: "org:admin" | "org:member" | "org:owner";
	}) {
		this.logger.info(
			"Updating workspace role with\n\tuserId:     %s\n\tworkspaceId: %s\n\trole:       %s",
			userId,
			workspaceId,
			role,
		);

		await this.clerkClient.organizations.updateOrganizationMembership({
			organizationId: workspaceId,
			userId,
			role,
		});
	}

	async joinWorkspace({
		user: { id, name, email },
		workspaceId,
	}: {
		user: { id: string; name: string; email: string };
		workspaceId: string;
	}): Promise<Workspace | null> {
		this.logger.info(
			`User ${name} attempting to join workspace ${workspaceId}`,
		);
		const [workspace] = await this.db.transaction(async (tx) => {
			const [user] = await tx
				.insert(usersTable)
				.values({
					externalId: id,
					name,
					email,
				})
				.onConflictDoNothing({ target: [usersTable.externalId] })
				.returning();

			await tx
				.insert(userWorkspacesTable)
				.values({
					userId: user.externalId,
					workspaceId,
				})
				.onConflictDoNothing({ target: [userWorkspacesTable.userId] })
				.returning();

			return await tx
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.externalId, workspaceId));
		});

		return workspace;
	}
	async removeUserFromWorkspace({
		workspaceId,
		userId,
	}: {
		workspaceId: string;
		userId: string;
	}): Promise<{ success: boolean }> {
		this.logger.info("Removing user from workspace");

		return await this.db.transaction(async (tx) => {
			// Find workspace teams
			const workspaceTeams = await tx
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.workspaceId, workspaceId));

			// Remove user from teams
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

			// Remove user from workspace
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
	}
	async inviteToWorkspace({
		workspaceId,
		email,
		userId,
		slug,
	}: {
		workspaceId: string;
		email: string[];
		userId: string;
		slug: string;
	}): Promise<{ success: boolean }> {
		this.logger.info("Inviting user to workspace", {
			email,
			workspaceId,
		});
		const emails = Array.isArray(email) ? email : [email];
		const inviteUser =
			this.clerkClient.organizations.createOrganizationInvitation;
		await Promise.all(
			emails.map((e) =>
				inviteUser({
					organizationId: workspaceId,
					emailAddress: e,
					inviterUserId: userId,
					role: "member",
					redirectUrl: `${process.env.NEXT_PUBLIC_CONFIRM_URL}/${slug}/join`,
				}),
			),
		);

		return await this.db.transaction(async (tx) => {
			// Check if the workspace exists
			const workspaceWithUsers = await tx
				.select({
					workspace: workspacesTable,
					user: usersTable,
				})
				.from(workspacesTable)
				.leftJoin(
					userWorkspacesTable,
					eq(userWorkspacesTable.workspaceId, workspacesTable.externalId),
				)
				.leftJoin(
					usersTable,
					eq(userWorkspacesTable.userId, usersTable.externalId),
				)
				.where(eq(workspacesTable.externalId, workspaceId));

			if (workspaceWithUsers.length === 0) {
				this.throwError("Workspace not found.");
			}

			const workspace = workspaceWithUsers[0].workspace;
			const workspaceEmails = workspaceWithUsers
				.map((row) => row.user?.email)
				.filter((email): email is string => email !== undefined);

			// Generate token
			const token = jwt.sign({ workspaceId, email }, this.JWT_SECRET, {
				expiresIn: "1h",
			});

			const emailsToSend = Array.isArray(email) ? email : [email];
			const existingUsers = await tx
				.select()
				.from(usersTable)
				.where(inArray(usersTable.email, emailsToSend));

			// Send email with the token
			for (const email of emailsToSend.filter(
				(email) => !workspaceEmails.includes(email),
			)) {
				const newUser = !existingUsers.some((u) => u.email === email);
				await sendMail({
					logger: this.logger,
					email,
					subject: "Workspace Invitation",
					html: joinWorkspaceTemplate({
						username: existingUsers.find((u) => u.email === email)?.name,
						path: newUser ? `register?token=${token}` : `login?token=${token}`,
						workspaceName: workspace.name,
					}),
				});
			}

			return { success: true };
		});
	}
	async getTakenWorkspaceUrls(): Promise<string[]> {
		this.logger.info("Getting taken workspace urls");

		return await this.db
			.select({ url: workspacesTable.url })
			.from(workspacesTable)
			.then((results) => results.map((result) => result.url));
	}

	async getWorkspaceLabels({
		workspaceId,
	}: { workspaceId: string }): Promise<Label[]> {
		this.logger.info("Getting labels for workspace with id %s", workspaceId);
		return await this.db
			.select()
			.from(workspacesTable)
			.where(eq(workspacesTable.id, workspaceId))
			.then((results) => results[0].labels);
	}

	async createWorkspaceLabel({
		workspaceId,
		label,
	}: { workspaceId: string; label: Label }): Promise<{
		success: boolean;
		labels?: Label[];
	}> {
		this.logger.info("Creating label for workspace with id %s", workspaceId);

		return await this.db.transaction(async (tx) => {
			const workspace = await tx
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.id, workspaceId))
				.limit(1)
				.then((results) => results[0]);

			if (!workspace) {
				throw new Error("Workspace not found.");
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
				throw new Error("Update failed.");
			}

			return { success: true, labels: updated.labels };
		});
	}

	async updateWorkspaceLabel({
		workspaceId,
		labelName,
		updatedLabel,
	}: {
		workspaceId: string;
		labelName: string;
		updatedLabel: Label;
	}): Promise<{
		success: boolean;
		labels: Label[];
	}> {
		this.logger.info(
			"Editing label %s for workspace with id %s",
			labelName,
			workspaceId,
		);
		return await this.db.transaction(async (tx) => {
			const workspace = await tx
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.id, workspaceId))
				.limit(1)
				.then((results) => results[0]);
			if (!workspace) {
				throw new Error("Workspace not found.");
			}
			this.logger.error("workspace", workspace);

			//Find label to update
			const labels = workspace.labels;
			const labelIndex = labels.findIndex((l) => l.name === labelName);
			if (labelIndex === -1) {
				throw new Error("Label not found.");
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
				throw new Error("Update failed.");
			}
			return { success: true, labels: updated.labels };
		});
	}

	async deleteWorkspaceLabel({
		workspaceId,
		labelName,
	}: { workspaceId: string; labelName: string }): Promise<{
		success: boolean;
	}> {
		this.logger.info(
			"Deleting label %s for workspace with id %s",
			labelName,
			workspaceId,
		);

		return await this.db.transaction(async (tx) => {
			const workspace = await tx
				.select()
				.from(workspacesTable)
				.where(eq(workspacesTable.id, workspaceId))
				.then((results) => results[0]);

			if (!workspace) {
				this.throwError("Workspace not found.");
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
	}

	private throwError(message: string): never {
		this.logger.error(message);
		throw new Error(message);
	}
}
