import { Types } from "mongoose";
import ITeam from "./team";
import IUsersRoles from "./userRoles";

interface IWorkspace {
  id: any;
  name: string;
  url: string;
  companySize: number;
  teams: ITeam[];
  projects: Types.ObjectId;
  users: IUsersRoles[];
  universalTokenLink: {
    token: string;
    isEnabled: boolean;
  };
  issuesCreated: number;
  githubRepoInfo: {
    repoName: string;
    owner: string;
  }
}

export default IWorkspace;
