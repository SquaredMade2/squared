import { createSlice } from '@reduxjs/toolkit';

export interface showNewIssueState {
  isOpen: boolean;
}

const initialState: showNewIssueState = {
  isOpen: false,
};

const showNewIssue = createSlice({
  name: 'showNewIssue',
  initialState: initialState,
  reducers: {
    setShowNewIssue(state, action) {
      state.isOpen = !!action.payload;
    },
  },
});

export const { setShowNewIssue } = showNewIssue.actions;
export default showNewIssue;
