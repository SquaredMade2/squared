export interface ListOfUsersProps {
  user?: string;
  role: string;
  _id: string;
  name: string;
  email?: string;
  workspaces?: unknown;
  username?: string;
}

export interface SelectedMemberProps {
  id: string;
  name?: string;
  username?: string;
}
