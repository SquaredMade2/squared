import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDb, inArray } from "../index";
import { sprintsTable, teamsTable, workspacesTable } from "../schema";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const db = createDb({ databaseUrl });

describe("Single active sprint unique index test", () => {
	it("should not allow two active sprints for the same team", async () => {
		const uniqueId = randomUUID();
		const workspaceUrl = `test-workspace-url-${uniqueId}`;
		const workspaceId = `test-workspace-${uniqueId}`;
		await db.insert(workspacesTable).values({
			admins: [],
			avatarUrl: "",
			companySize: 1,
			createdAt: new Date(),
			daysUntilArchive: 14,
			defaultView: null,
			externalId: workspaceId,
			inviteLinks: [],
			labels: [],
			name: "Test Workspace",
			tasksCreated: 0,
			url: workspaceUrl,
		});

		const teamId = randomUUID();

		await db.insert(teamsTable).values({
			cooldownDuration: 1,
			effort: "LINEAR",
			id: teamId,
			identifier: "test-team",
			name: "Test Team",
			sprintDuration: 2,
			sprintStartDate: new Date(),
			sprintsEnabled: true,
			tasksPerSprint: 10,
			workspaceId,
		});

		const sprint1Id = randomUUID();
		await db.insert(sprintsTable).values({
			createdAt: new Date(),
			endDate: new Date(),
			id: sprint1Id,
			name: "Sprint 1",
			startDate: new Date(),
			status: "ACTIVE",
			teamId,
			updatedAt: new Date(),
		});

		let errorCaught = false;
		const sprint2Id = randomUUID();
		try {
			await db.insert(sprintsTable).values({
				createdAt: new Date(),
				endDate: new Date(),
				id: sprint2Id,
				name: "Sprint 2",
				startDate: new Date(),
				status: "ACTIVE",
				teamId,
				updatedAt: new Date(),
			});
		} catch (_) {
			errorCaught = true;
		}

		expect(errorCaught).toBe(true);

		// Clean up the database
		await db
			.delete(sprintsTable)
			.where(
				inArray(
					sprintsTable.id,
					[sprint1Id, sprint2Id].filter(Boolean) as string[],
				),
			);
		await db.delete(teamsTable).where(eq(teamsTable.id, teamId));
		await db
			.delete(workspacesTable)
			.where(eq(workspacesTable.externalId, workspaceId));
	});
});
