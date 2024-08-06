import { createSlice } from "@reduxjs/toolkit";

export interface showSearchModalState {
  isOpen: boolean;
}

const initialState: showSearchModalState = {
  isOpen: false,
};

const showSearchModal = createSlice({
  name: "showSearchModal",
  initialState: initialState,
  reducers: {
    setShowSearchModal(state, action) {
      state.isOpen = !!action.payload;
    },
  },
});

export const { setShowSearchModal } = showSearchModal.actions;
export default showSearchModal;
