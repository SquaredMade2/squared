import type { Sprint } from "@squaredmade/db";

export type SprintState = {
	sprints: Sprint[];
	sprint: Sprint | null;
};
type SprintActions = {
	setSprint: (task: Sprint) => void;
	setSprints: (tasks: Sprint[]) => void;
	updateSprint: (task: Sprint) => void;
	createSprint: (task: Sprint) => void;
};

export type SprintStore = SprintState & SprintActions;
