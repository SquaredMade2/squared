import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { ModalState, ModalStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@repo/db";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/task/${path}`;

export const createModalStore = (
	initState: ModalState = {
		showTaskForm: false,
		showCommand: false,
		taskFormData: {},
	},
) => {
	return createStore<ModalStore>()((set) => ({
		...initState,
		setShowTaskForm: (input) => async () => {
			set({ showTaskForm: input });
		},
		setTaskFormData: (task) => async () => {
			set({ taskFormData: task });
		},
		setShowCommand: (input) => async () => {
			set({ showCommand: input });
		},
	}));
};
