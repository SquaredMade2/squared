import type { Types } from "mongoose";
import type ITeam from "./team";
import type IUsersRoles from "./userRoles";

interface IWorkspace {
	id: string;
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
	};
}

export default IWorkspace;
