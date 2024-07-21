import { createSlice } from '@reduxjs/toolkit';

export interface isCmdPaletteInitialState {
  isCmdPalette: boolean;
}

const initialState: isCmdPaletteInitialState = {
  isCmdPalette: false,
};

const isCmdPalette = createSlice({
  name: 'isCmdPalette',
  initialState: initialState,
  reducers: {
    setIsCmdPalette(state, action) {
      state.isCmdPalette = !!action.payload;
    },
  },
});

export const { setIsCmdPalette } = isCmdPalette.actions;
export default isCmdPalette;
