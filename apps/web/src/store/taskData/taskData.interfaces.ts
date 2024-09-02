import type { Workspace } from "@repo/db";

export interface TaskDataState {
	access: Access;
	error: boolean;
	status: string;
	priority: string | null;
	dueDate: Date | undefined;
	effortEstimate: number | null;
	taskPage: Task;
	taskList: Task[];
	workspaces: Workspace[];
	currentWorkspace: Workspace;
	currentTeam: Team;
	allUsersInWorkspace: UsersInWorkspace[];
	prevWorkspaceUrl: string;
	labels: string[];
	isLoading: boolean;
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

export interface Task {
	authorId: string;
	taskName: string;
	_id: string;
	title: string;
	description: string;
	status: string;
	identifier: string;
	priority: string | null;
	labels: string[];
	dueDate: Date | undefined;
	effortEstimate: number | null;
	team: Team;
	dateCreated: Date;
	assignee: Assignee | null;
}

export interface Assignee {
	name: string | null;
	id: string | null;
}

export interface User {
	default_workspace: null;
	email: string;
	last_login: string;
	name: string;
	on_boarding: boolean;
	password: string;
	teams: [];
	username: string;
	workspaces: Workspace[];
	_id: string;
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
