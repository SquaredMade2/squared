import type { CurrentWorkspace } from '../taskData/taskData.interfaces';

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

export interface GithubUser {
  avatar_url: string;
  bio: string | null;
  blog: string | null;
  company: string | null;
  created_at: string;
  email: string | null;
  events_url: string;
  followers: number;
  followers_url: string;
  following: number;
  following_url: string;
  gists_url: string;
  gravatar_id: string | null;
  hireable: boolean | null;
  html_url: string;
  id: number;
  location: string | null;
  login: string;
  name: string | null;
  node_id: string;
  organizations_url: string;
  public_gists: number;
  private_gists: number;
  public_repos: number;
  total_private_repos: number;
  owned_private_repos: number;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  twitter_username: string | null;
  type: string;
  updated_at: string;
  url: string;
  disk_usage: number;
}

export interface UserSettingsState {
  showNavBar: boolean;
  user: User;
  theme: string;
  view: string;
  isLoading: boolean;
  isError: boolean;
  ghAuthToken: string;
  githubUser: GithubUser | null;
}
