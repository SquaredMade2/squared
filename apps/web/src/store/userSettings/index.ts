import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  UserSettingsState,
  User,
} from "./userSettings.interfaces";
import {
  updateProfile,
  getUser,
  getUserById,
  getGithubUserData,
  setGithubAuthToken,
} from "./thunks";

const initialState: UserSettingsState = {
  showNavBar: false,
  user: {
    default_workspace: null,
    email: "",
    last_login: "",
    name: "",
    on_boarding: false,
    password: "",
    teams: [],
    username: "",
    workspaces: [],
    _id: "",
  },
  theme: "light",
  view: "list",
  isLoading: false,
  isError: false,
  ghAuthToken: "",
  githubUser: null,
};

const userSettings = createSlice({
  name: "userSettings",
  initialState: initialState,
  reducers: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    navBarToggle(state, action: PayloadAction<boolean>) {
      state.showNavBar = action.payload;
    },
    clearUser(state) {
      state.user = {
        default_workspace: null,
        email: "",
        last_login: "",
        name: "",
        on_boarding: false,
        password: "",
        teams: [],
        username: "",
        workspaces: [],
        _id: "",
      };
    },
    handleTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
    },
    setView(state, action: PayloadAction<string>) {
      state.view = action.payload;
    },
    clearGithubAuthToken(state) {
      state.ghAuthToken = "";
    },
    clearGithubUser(state) {
      state.githubUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isLoading = false;
          state.isError = false;
        }
      )
      .addCase(updateProfile.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isLoading = false;
          state.isError = false;
        }
      )
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        getUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.isError = false;
        }
      )
      .addCase(getUserById.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(setGithubAuthToken.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        setGithubAuthToken.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.ghAuthToken = action.payload;
          state.isLoading = false;
          state.isError = false;
        }
      )
      .addCase(setGithubAuthToken.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getGithubUserData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        getGithubUserData.fulfilled,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (state, action: PayloadAction<any>) => {
          state.githubUser = action.payload;
          state.isLoading = false;
          state.isError = false;
        }
      )
      .addCase(getGithubUserData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {
  setUser,
  navBarToggle,
  clearUser,
  handleTheme,
  setView,
  clearGithubAuthToken,
  clearGithubUser,
} = userSettings.actions;
export default userSettings;
