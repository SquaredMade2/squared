import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, Team } from "../taskData/taskData.interfaces";

export interface recentlyDeletedState {
  recentlyDeleted: Task;
}

const initialState: recentlyDeletedState = {
  recentlyDeleted: {
    _id: "",
    title: "",
    status: "Todo",
    identifier: "",
    priority: null,
    labels: [],
    dueDate: null,
    effortEstimate: null,
    description: "",
    team: null as unknown as Team,
    assignee: null,
    dateCreated: new Date(),
    authorId: "",
    taskName: "",
  },
};

const recentlyDeleted = createSlice({
  name: "recentlyDeleted",
  initialState: initialState,
  reducers: {
    setRecentlyDeleted(state, action: PayloadAction<Task>) {
      state.recentlyDeleted = action.payload;
    },
  },
});

export const { setRecentlyDeleted } = recentlyDeleted.actions;
export default recentlyDeleted;
