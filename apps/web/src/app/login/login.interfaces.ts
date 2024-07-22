import type { Team, Workspace } from '@/store/taskData/taskData.interfaces';
import 'next-auth';
export interface FormData {
  email: string;
  password: string;
}

export interface LocalUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  on_boarding: boolean;
  default_workspace: string | null;
  workspaces: Array<Workspace>;
  teams: Array<Team>;
  last_login: string;
  __v: number;
}

declare module 'next-auth' {
  interface Session {
    userData?: {
      on_boarding?: boolean;
      workspaces?: { url: string }[];
    };
  }

  interface User {
    userData?: {
      on_boarding?: boolean;
      workspaces?: { url: string }[];
      email?: string;
    };
  }
  interface JWT {
    idToken?: string;
  }
}
