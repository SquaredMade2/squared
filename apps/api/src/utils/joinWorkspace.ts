import {
	type DBClient,
	type User,
	type WorkspaceLabel,
	and,
	eq,
	labelsTable,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

async function getWorkspaceWithLabels(
	db: DBClient,
	workspaceId: string,
): Promise<WorkspaceLabel | null> {
	const results = await db
		.select()
		.from(workspacesTable)
		.leftJoin(labelsTable, eq(workspacesTable.id, labelsTable.workspaceId))
		.where(eq(workspacesTable.id, workspaceId));

	const workspaceWithLabels = results.reduce(
		(acc, row) => {
			if (!acc.workspace) {
				acc.workspace = { ...row.Workspace, labels: [] };
			}
			if (row.Label) {
				acc.workspace.labels.push(row.Label);
			}
			return acc;
		},
		{ workspace: null as WorkspaceLabel | null },
	).workspace;

	return workspaceWithLabels;
}

type APIResponse<Type> = {
	data: Type | null;
	message?: string;
	variant: "default" | "destructive";
};

export const joinWorkspace = async (
	token: string,
	userId: string,
	db: DBClient,
): Promise<APIResponse<User> & { status: number }> => {
	if (!JWT_SECRET) {
		return {
			data: null,
			message: "JWT_SECRET is not defined.",
			variant: "destructive",
			status: 500,
		};
	}

	// Verify the token
	const decoded = jwt.verify(token, JWT_SECRET) as {
		workspaceId: string;
	};

	const [[existingUserWorkspace], workspace, [user], teams] = await Promise.all(
		[
			db
				.select()
				.from(userWorkspacesTable)
				.where(
					and(
						eq(userWorkspacesTable.userId, userId),
						eq(userWorkspacesTable.workspaceId, decoded.workspaceId),
					),
				),
			getWorkspaceWithLabels(db, decoded.workspaceId),
			db.select().from(usersTable).where(eq(usersTable.id, userId)),
			db
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.workspaceId, decoded.workspaceId)),
		],
	);

	if (existingUserWorkspace) {
		return {
			data: user,
			message: "You're already a member of this workspace!",
			variant: "default",
			status: 200,
		};
	}

	if (!workspace) {
		return {
			data: null,
			message: "Workspace not found.",
			variant: "destructive",
			status: 404,
		};
	}
	if (teams.length === 0) {
		return {
			data: null,
			message: "No teams found in this workspace.",
			variant: "destructive",
			status: 404,
		};
	}
	if (!user) {
		return {
			data: null,
			message: "User not found.",
			variant: "destructive",
			status: 404,
		};
	}

	try {
		await Promise.all([
			db.insert(userWorkspacesTable).values({
				userId,
				workspaceId: decoded.workspaceId,
			}),
			db.insert(userTeamsTable).values(
				teams.map((team) => ({
					userId,
					teamId: team.id,
				})),
			),
		]);
	} catch (error) {
		return {
			data: null,
			message:
				error instanceof Error ? error.message : "Failed to join workspace.",
			variant: "destructive",
			status: 500,
		};
	}

	if (user.onBoarding) {
		db.update(usersTable)
			.set({ onBoarding: false })
			.where(eq(usersTable.id, userId));
	}
	return {
		data: user,
		message: "User successfully joined the workspace.",
		variant: "default",
		status: 200,
	};
};
