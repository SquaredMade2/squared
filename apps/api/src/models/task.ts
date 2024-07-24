import { Schema, model } from "mongoose";
import type ITask from "../interface/task";

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - status
 *         - team
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         identifer:
 *           type: string
 *         priority:
 *           type: string
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *         dueDate:
 *           type: Date
 *         effortEstimate:
 *           type: number
 *         team:
 *           $ref: '#/components/schemas/Team'
 */

const taskSchema = new Schema<ITask>({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
  },
  labels: {
    type: Array,
  },
  dueDate: {
    type: Date,
  },
  effortEstimate: {
    type: Number,
  },
  team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  dateCreated: {
    type: Date,
  },
  assignee: {
    id: { type: Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, ref: "User", default: null },
  },
});

const TaskModel = model<ITask>("Task", taskSchema);

export default TaskModel;
