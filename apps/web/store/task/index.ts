import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getSingleTask } from "@/store/task/thunks";
import { toast } from "react-toastify";
import type { Assignee } from "../taskData/taskData.interfaces";

export interface TaskInitialState {
  isLoading: boolean;
  data: undefined | SingleTaskDataInterface;
  isError: boolean;
}

// future todo: this interface has to be moved to a seperate file.
export interface SingleTaskDataInterface {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  labels: string[];
  dueDate: Date;
  effortEstimate: number;
  team: string;
  dateCreated: string;
  assignee: Assignee;
  identifier: number;
}

const initialState: TaskInitialState = {
  isLoading: false,
  data: undefined,
  isError: false,
};

const singleTask = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    setGetSingleTaskError(state, action: PayloadAction<boolean>) {
      state.isError = action.payload;
    },
    removeTaskData(state) {
      state.data = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getSingleTask.fulfilled,
        (state, action: PayloadAction<SingleTaskDataInterface>) => {
          state.data = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(getSingleTask.rejected, (state, action) => {
        console.error(action.payload);
        toast.error("could not get task");
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setGetSingleTaskError, removeTaskData } =
  singleTask.actions;

export default singleTask;

// I am not sure if hasTask and taskPageInitialRender are being used, they could be removed, but I am not sure. -- Pinak

export function hasTask(state: {
  singleTask: { isLoading: boolean; data: SingleTaskDataInterface };
}): boolean {
  const singleTaskData = state.singleTask.data !== null;

  return !state.singleTask.isLoading && singleTaskData;
}

export function taskPageInitialRender(state: {
  singleTask: { isLoading: boolean; data: SingleTaskDataInterface };
}): boolean {
  return !state.singleTask.isLoading && !state.singleTask.data;
}
