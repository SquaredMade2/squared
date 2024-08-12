import { createStore } from "zustand/vanilla";
import { initTaskState } from "./tasks";
import type { TaskActions, TaskState } from "./tasks/interfaces";

export type RootState = {
  tasks: TaskState;
};

export type RootActions = {
  tasks: TaskActions;
};

export type Store = RootState & RootActions;

export const defaultInitState: RootState = {
  tasks: initTaskState,
};

export const createCounterStore = (
  initState: RootState = defaultInitState
) => {
  return createStore<Store>()((set) => ({
    ...initState,
    tasks: initTaskState,
  }));
};
