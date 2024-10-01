import { prisma } from "@/api";
import { addWeeks } from "date-fns";
import logger from "@repo/logger";

export async function handleSprintTransitions() {
	try {
		// Close completed sprints
		await closeCompletedSprints();

		// Activate next planned sprint
		await activateNextSprint();

		// Create new planned sprints
		await createNewPlannedSprints();

		logger.info("Sprint transitions completed successfully");
	} catch (error) {
		logger.error("Error in sprint transitions:", error);
	}
}

async function closeCompletedSprints() {
	const today = new Date();
	await prisma.sprint.updateMany({
		where: {
			status: "ACTIVE",
			endDate: { lte: today },
		},
		data: {
			status: "COMPLETED",
		},
	});
}

async function activateNextSprint() {
	const nextSprint = await prisma.sprint.findFirst({
		where: {
			status: "PLANNED",
			startDate: { lte: new Date() },
		},
		orderBy: {
			startDate: "asc",
		},
	});

	if (nextSprint) {
		await prisma.sprint.update({
			where: { id: nextSprint.id },
			data: { status: "ACTIVE" },
		});
	}
}

async function createNewPlannedSprints() {
	const teams = await prisma.team.findMany({
		where: { sprintsEnabled: true },
		include: {
			Sprints: {
				where: { status: "PLANNED" },
				orderBy: { endDate: "desc" },
			},
		},
	});

	for (const team of teams) {
		const plannedSprintsCount = team.Sprints.length;
		const sprintsToCreate = team.upcomingSprints - plannedSprintsCount;

		if (sprintsToCreate > 0) {
			const lastPlannedSprint = team.Sprints[0];
			let startDate = lastPlannedSprint
				? addWeeks(lastPlannedSprint.endDate, team.cooldownDuration / 7)
				: new Date();

			for (let i = 0; i < sprintsToCreate; i++) {
				const endDate = addWeeks(startDate, team.sprintDuration);
				await prisma.sprint.create({
					data: {
						name: `Sprint ${team.Sprints.length + i + 1}`,
						startDate,
						endDate,
						status: "PLANNED",
						teamId: team.id,
					},
				});
				startDate = addWeeks(endDate, team.cooldownDuration / 7);
			}
		}
	}
}
