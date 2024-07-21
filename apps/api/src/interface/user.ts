import { Types } from "mongoose";
import IWorkspace from "./workspace";
import ITask from "./task";

interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  default_workspace: Types.ObjectId;
  last_login: Date;
  workspaces: IWorkspace[];
  teams: Types.ObjectId;
  on_boarding: boolean;
  verified: boolean;
  join_workspace: string[];
  tasks: ITask[]
}

export default IUser;
