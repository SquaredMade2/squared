import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import isCmdPalette from "./isCmdPalette";
import showTaskForm from "./showTaskForm";
import toggleTaskFeatures from "./toggleTaskFeatures";
import userSettings from "./userSettings";
import taskData from "./taskData";
import showNewIssue from "./showNewIssue";
import resumeNewIssue from "./resumeNewIssue";
import singleTask from "./task";
import filterPage from "./filterPage";
import events from "./events";
import getListOfMembersReducer from "./workspaceMembers";
import notificationReducer from "./notifications";
import currentTaskReducer from "./currentTask";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

const rootReducer = combineReducers({
  toggleTaskFeatures: toggleTaskFeatures.reducer,
  userSettings: userSettings.reducer,
  isCmdPalette: isCmdPalette.reducer,
  showTaskForm: showTaskForm.reducer,
  taskData: taskData.reducer,
  showNewIssue: showNewIssue.reducer,
  resumeNewIssue: resumeNewIssue.reducer,
  singleTask: singleTask.reducer,
  notifications: notificationReducer,
  currentTask: currentTaskReducer,
  listOfWorkspaceMembers: getListOfMembersReducer,
  filterPage,
  events,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userSettings", "toggleTaskFeatures", "taskData"],
  debug: true,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
