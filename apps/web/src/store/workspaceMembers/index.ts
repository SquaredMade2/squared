import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// interface
export interface WorkspaceMember {
  name: string;
  id: string;
  email: string;
}

interface ListOfMembersProps {
  listOfWorkspaceMembers: WorkspaceMember[];
}
// initial state
const initialState: ListOfMembersProps = {
  listOfWorkspaceMembers: [],
};

// createslice
const getListOfMembersSlice = createSlice({
  name: 'listOfMembers',
  initialState,
  reducers: {
    getListOfMembers(state, action: PayloadAction<WorkspaceMember[]>) {
      state.listOfWorkspaceMembers = action.payload;
    },
  },
});

export default getListOfMembersSlice.reducer;
export const { getListOfMembers } = getListOfMembersSlice.actions;
