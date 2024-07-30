import type { Types } from "mongoose";
import type IWorkspace from "./workspace";
import type ITask from "./task";

interface IUser {
	id: Types.ObjectId;
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
	tasks: ITask[];
}

export default IUser;
