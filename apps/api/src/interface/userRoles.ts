import type { Types } from "mongoose";
import type IUser from "./user";
interface IUsersRoles {
  user: IUser;
  role: string;
  username: string;
}

export default IUsersRoles;
