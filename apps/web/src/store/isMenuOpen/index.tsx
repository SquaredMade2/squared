import { createSlice } from "@reduxjs/toolkit";

export interface isMenuOpenState {
  isMenuOpen: boolean;
}

const initialState: isMenuOpenState = {
  isMenuOpen: false,
};

const isMenuOpen = createSlice({
  name: "isMenuOpen",
  initialState: initialState,
  reducers: {
    setIsMenuOpen(state, action) {
      state.isMenuOpen = !!action.payload;
    },
  },
});

export const { setIsMenuOpen } = isMenuOpen.actions;
export default isMenuOpen;
