import type { Types } from "mongoose";
import IUser from "./user";
import ITeam from "./team";
import IWorkspace from "./workspace";

interface ITask {
  id: string;
  authorId: Types.ObjectId;
  title: string;
  description: string;
  status: string;
  identifier: string;
  priority: string;
  labels: (string | number)[];
  dueDate: Date | null;
  effortEstimate: number;
  team: Types.ObjectId;
  dateCreated: Date | null;
  assignee: Assignee;
}

interface Assignee {
  id: Types.ObjectId;
  name: string;
}

export default ITask;
