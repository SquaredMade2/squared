import type { Label, Priority, Status, Task, User, Workspace } from "@repo/db";

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
	loadingState: string;
	currentCommits: Commits[];
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

interface Author {
	name: string;
	email: string;
	username: string;
}

interface Commiter {
	name: string;
	email: string;
	username: string;
}

export interface Commits {
	id: string;
	tree_id: string;
	distinct: boolean;
	message: string;
	timestamp: string;
	url: string;
	author: Author;
	committer: Commiter;
	added: [];
	removed: [];
	modified: string[];
	repoName: string;
	owner: string;
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
