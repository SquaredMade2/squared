import { combineReducers, type Store } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";

// Import your slices or reducers
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

// Combine all slice reducers into a rootReducer using combineReducers
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

// Configure persistence
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["userSettings", "toggleTaskFeatures", "taskData"], // Only persist specific slices
	debug: true,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

// Create the persistor
export const persistor = persistStore(store as unknown as Store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
