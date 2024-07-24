import type { Types } from "mongoose";
import type ITask from "./task";

interface ITeam {
  _id: Types.ObjectId;
  name: string;
  workspace: Types.ObjectId;
  users: Types.ObjectId[];
  tasks: ITask[];
  identifier: string;
}

export default ITeam;
