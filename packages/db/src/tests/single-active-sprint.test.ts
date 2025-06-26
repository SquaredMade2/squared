import { describe, it, expect } from "vitest";
import { createDb, inArray } from "../index";
import { sprintsTable, teamsTable, workspacesTable } from "../schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const db = createDb({ databaseUrl });

describe("Single active sprint unique index test", () => {
	it("should not allow two active sprints for the same team", async () => {
		const uniqueId = randomUUID();
		const workspaceUrl = `test-workspace-url-${uniqueId}`;
		const workspaceId = `test-workspace-${uniqueId}`;
		await db.insert(workspacesTable).values({
			externalId: workspaceId,
			name: "Test Workspace",
			url: workspaceUrl,
			companySize: 1,
			tasksCreated: 0,
			avatarUrl: "",
			admins: [],
			defaultView: null,
			createdAt: new Date(),
			labels: [],
			inviteLinks: [],
			daysUntilArchive: 14,
		});

		const teamId = randomUUID();

		await db.insert(teamsTable).values({
			id: teamId,
			name: "Test Team",
			identifier: "test-team",
			workspaceId: workspaceId,
			sprintsEnabled: true,
			sprintDuration: 2,
			cooldownDuration: 1,
			sprintStartDate: new Date(),
			tasksPerSprint: 10,
			effort: "LINEAR",
		});

		const sprint1Id = randomUUID();
		await db.insert(sprintsTable).values({
			id: sprint1Id,
			name: "Sprint 1",
			startDate: new Date(),
			endDate: new Date(),
			status: "ACTIVE",
			teamId,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		let errorCaught = false;
		const sprint2Id = randomUUID();
		try {
			await db.insert(sprintsTable).values({
				id: sprint2Id,
				name: "Sprint 2",
				startDate: new Date(),
				endDate: new Date(),
				status: "ACTIVE",
				teamId,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		} catch (e) {
			errorCaught = true;
		}

		expect(errorCaught).toBe(true);
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
