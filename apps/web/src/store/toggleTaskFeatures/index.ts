import { createSlice } from '@reduxjs/toolkit';

export interface ToggleTaskInitialState {
  showDateTime: boolean;
  showPriority: boolean;
  showLabels: boolean;
}

const initialState: ToggleTaskInitialState = {
  showDateTime: true,
  showPriority: true,
  showLabels: true,
};

const toggleTaskFeatures = createSlice({
  name: 'toggleTaskFeatures',
  initialState: initialState,
  reducers: {
    setShowDateTime(state) {
      state.showDateTime = !state.showDateTime;
    },
    setShowPriority(state) {
      state.showPriority = !state.showPriority;
    },
    setShowLabels(state) {
      state.showLabels = !state.showLabels;
    },
  },
});

export const { setShowDateTime, setShowPriority, setShowLabels } = toggleTaskFeatures.actions;
export default toggleTaskFeatures;
