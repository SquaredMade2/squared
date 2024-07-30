import { Schema, model } from "mongoose";
import type INotification from "../interface/notification";

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    task: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    read: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
