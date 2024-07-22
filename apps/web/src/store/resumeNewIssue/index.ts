import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface resumeNewIssueState {
  hasData: boolean;
}

const initialState: resumeNewIssueState = {
  hasData: false,
};

const resumeNewIssue = createSlice({
  name: 'resumeNewIssue',
  initialState: initialState,
  reducers: {
    setResumeNewIssue(state, action: PayloadAction<boolean>) {
      state.hasData = !!action.payload;
    },
  },
});

export const { setResumeNewIssue } = resumeNewIssue.actions;
export default resumeNewIssue;
