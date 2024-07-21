export interface TaskDataState {
  access: Access;
  error: boolean;
  status: string;
  priority: string | null;
  dueDate: Date | null;
  effortEstimate: number | null;
  taskPage: Task;
  taskList: Task[];
  workspaces: Workspace[];
  currentWorkspace: CurrentWorkspace;
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

export interface CurrentWorkspace {
  companySize: number;
  name: string;
  teams: Team[];
  url: string;
  users: { name: string; user: string; role: string }[];
  _id: string;
  universalTokenLink: { token: string; isEnabled: boolean };
  issuesCreated: number;
  githubRepoInfo: GithubRepo;
}

export interface Team {
  identifier: string;
  name: string;
  tasks: Task[];
  workspace: string;
  _id: string;
  users: User[];
}

export interface Workspace {
  companySize: number;
  name: string;
  teams: string[];
  url: string;
  users: string[];
  _id: string;
  issuesCreated: number;
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
	dueDate: Date | null;
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
  workspaces: CurrentWorkspace[];
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
