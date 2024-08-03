import { createSlice } from "@reduxjs/toolkit";

export interface isWidgetOpenState {
  isWidgetOpen: boolean;
}

const initialState: isWidgetOpenState = {
  isWidgetOpen: false,
};

const isWidgetOpen = createSlice({
  name: "isWidgetOpen",
  initialState: initialState,
  reducers: {
    setIsWidgetOpen(state, action) {
      state.isWidgetOpen = !!action.payload;
    },
  },
});

export const { setIsWidgetOpen } = isWidgetOpen.actions;
export default isWidgetOpen;
