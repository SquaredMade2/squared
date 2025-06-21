import { createStore } from "zustand/vanilla";
import type { SprintState, SprintStore } from "./interfaces";

export { SprintStoreProvider, useSprintStore } from "./store";

export const createSprintStore = (
	initState: SprintState = { sprint: null, sprints: [] },
) => {
	return createStore<SprintStore>()((set) => ({
		...initState,
		createSprint: (sprint) =>
			set((state) => ({
				sprints: [...state.sprints, sprint],
			})),
		setSprint: (sprint) => set({ sprint }),
		setSprints: (sprints) => set({ sprints }),
		updateSprint: (sprint) =>
			set((state) => ({
				sprints: state.sprints.map((t) => (t.id === sprint.id ? sprint : t)),
			})),
	}));
};
