import { Types } from "mongoose";
interface IUsersRoles {
	user: Types.ObjectId;
	role: String;
	username: string;
}

export default IUsersRoles;
