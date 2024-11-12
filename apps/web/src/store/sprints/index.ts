import { createStore } from "zustand/vanilla";
import type { SprintState, SprintStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createSprintStore = (
	initState: SprintState = { sprints: [], sprint: null },
) => {
	return createStore<SprintStore>()((set) => ({
		...initState,
		setSprint: (sprint) => set({ sprint }),
		setSprints: (sprints) => set({ sprints }),
		createSprint: (sprint) =>
			set((state) => ({
				sprints: [...state.sprints, sprint],
			})),
		updateSprint: (sprint) =>
			set((state) => ({
				sprints: state.sprints.map((t) => (t.id === sprint.id ? sprint : t)),
			})),
	}));
};
