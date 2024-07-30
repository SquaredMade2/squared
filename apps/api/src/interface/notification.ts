import type { Types } from "mongoose";

interface INotification {
  user: Types.ObjectId;
  task: Types.ObjectId;
  read: boolean;
  description: string;
}

export default INotification;
