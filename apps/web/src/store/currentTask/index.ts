import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
  currentTaskId: string | null;
}

const initialState: TaskState = {
  currentTaskId: null,
};

const currentTaskSlice = createSlice({
  name: "currentTask",
  initialState,
  reducers: {
    setCurrentTaskId: (state, action: PayloadAction<string>) => {
      state.currentTaskId = action.payload;
    },
    clearCurrentTaskId: (state) => {
      state.currentTaskId = null;
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    getCurrentTaskId: (state: any) => {
      return state.currentTaskId;
    },
  },
});

export const {
  setCurrentTaskId,
  clearCurrentTaskId,
  getCurrentTaskId,
} = currentTaskSlice.actions;

export default currentTaskSlice.reducer;
