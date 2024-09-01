import { createStore, type StoreApi } from "zustand/vanilla";
import { createActivityStore, type ActivityStore } from "./activities";
import { createAuthStore, type AuthStore } from "./auth";
import { createCommentStore, type CommentStore } from "./comments";
import { createModalStore, type ModalStore } from "./modals";
import {
	createNotificationStore,
	type NotificationStore,
} from "./notifications";
import { createTaskStore, type TaskStore } from "./tasks";
import { createTeamStore, type TeamStore } from "./teams";
import { createUserStore, type UserStore } from "./users";
import { createViewsStore, type ViewsStore } from "./views";
import { createWorkspaceStore, type WorkspaceStore } from "./workspaces";

export type SquaredState = {
	activities: StoreApi<ActivityStore>;
	auth: StoreApi<AuthStore>;
	comments: StoreApi<CommentStore>;
	modals: StoreApi<ModalStore>;
	notifications: StoreApi<NotificationStore>;
	tasks: StoreApi<TaskStore>;
	teams: StoreApi<TeamStore>;
	users: StoreApi<UserStore>;
	views: StoreApi<ViewsStore>;
	workspaces: StoreApi<WorkspaceStore>;
};

export const createSquaredStore = () => {
	return createStore<SquaredState>()(() => ({
		activities: createActivityStore(),
		auth: createAuthStore(),
		comments: createCommentStore(),
		modals: createModalStore(),
		notifications: createNotificationStore(),
		tasks: createTaskStore(),
		teams: createTeamStore(),
		users: createUserStore(),
		views: createViewsStore(),
		workspaces: createWorkspaceStore(),
	}));
};
