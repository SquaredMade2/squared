import type { Types } from "mongoose";

interface IProject {
  name: string;
  team: Types.ObjectId;
}

export default IProject;
