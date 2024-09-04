import type {
	Label,
	Priority,
	Status,
	Task,
	User,
	Workspace,
	Commit,
} from "@repo/db";

export interface TaskDataState {
	access: Access;
	error: boolean;
	status: Status;
	priority: Priority;
	dueDate: Date;
	effortEstimate: number | null;
	taskPage: Task;
	taskList: Task[];
	workspaces: Workspace[];
	currentWorkspace: Workspace;
	currentTeam: Team;
	allUsersInWorkspace: UsersInWorkspace[];
	prevWorkspaceUrl: string;
	labels: Label[];
	isLoading: boolean;
	currentCommits: Commit[];
	loadingState: string;
}

export interface GithubRepo {
	repoName: string;
	owner: string;
}

export interface UsersInWorkspace {
	username: string;
	role: string;
	user: string;
}

export interface Team {
	identifier: string;
	name: string;
	tasks: Task[];
	workspace: string;
	_id: string;
	users: User[];
}

export interface Access {
	status: boolean;
	id: string;
}

export interface Assignee {
	name: string | null;
	id: string | null;
}

export interface AccessId {
	status: boolean;
	id: string;
}

export interface GetWorkspaceInterface {
	url: string;
	id: string;
}

export interface GetTeamInterface {
	name: string;
	identifier: string;
	workspaceId: string;
}

export interface AddWorkspaceInterface {
	name: string;
	url: string;
}
