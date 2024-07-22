import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface showTaskFormState {
  isOpen: boolean;
}

const initialState: showTaskFormState = {
  isOpen: false,
};

const showTaskForm = createSlice({
  name: 'showTaskForm',
  initialState: initialState,
  reducers: {
    setShowTaskForm(state, action: PayloadAction<boolean>) {
      state.isOpen = !!action.payload;
    },
  },
});

export const { setShowTaskForm } = showTaskForm.actions;
export default showTaskForm;
