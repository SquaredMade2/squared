import { Types } from "mongoose";

interface IProject {
  name: string;
  team: Types.ObjectId;
}

export default IProject;
