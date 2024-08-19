import { Schema, model } from "mongoose";
import type { TaskEventLog, TaskEvent, Comment } from "../interface/events";
import { Labels } from "../interface/events";

/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - author
 *         - date
 *         - task
 *       properties:
 *         type:
 *           type: string
 *           enum:
 *             - EVENT
 *             - COMMENT
 *         author:
 *           $ref: '#/components/schemas/User'
 *         date:
 *           type: string
 *         task:
 *           $ref: '#/components/schemas/Task'
 */

const taskEventLogSchema = new Schema<TaskEventLog>({
	author: {
		id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
	},
	createdAt: { type: Date, required: true },
	taskId: {
		type: Schema.Types.ObjectId,
		ref: "Task",
		required: true,
	},
	eventsLog: [
		{
			type: Schema.Types.ObjectId,
			ref: "TaskEvent",
		},
	],
});

const taskEventSchema = new Schema<TaskEvent>({
	type: {
		type: String,
		enum: [
			"titleUpdated",
			"descriptionUpdated",
			"gitUpdated",
			"statusUpdated",
			"priorityUpdated",
			"labelsUpdated",
			"assigneeUpdated",
		],
		required: true,
	},
	author: {
		id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
	},
	taskId: {
		type: Schema.Types.ObjectId,
		ref: "Task",
		required: true,
	},
	updatedAt: {
		type: Date,
		required: true,
	},
	originalLabels: {
		type: [String],
		enum: Object.values(Labels),
	},
	updatedLabels: {
		type: [String],
		enum: Object.values(Labels),
	},
	originalValue: {
		type: String,
	},
	updatedValue: {
		type: String,
	},
	originalAssignee: {
		id: { type: Schema.Types.Mixed, ref: "User" },
		name: String,
	},
	updatedAssignee: {
		id: { type: Schema.Types.Mixed, ref: "User" },
		name: String,
	},
	gitUpdate: {
		type: String,
	},
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *         - author
 *         - date
 *         - task
 *       properties:
 *         comment:
 *           type: string
 *         author:
 *           $ref: '#/components/schemas/User'
 *         date:
 *           type: string
 *         task:
 *           $ref: '#/components/schemas/Task'
 */

const commentSchema = new Schema<Comment>({
	comment: {
		required: [true, "A comment is required."],
		type: String,
	},
	author: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	date: {
		required: true,
		default: Date.now(),
		type: Date,
	},
	task: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: "Task",
	},
});

export const CommentModel = model<Comment>("Comment", commentSchema);
export const TaskEventModel = model<TaskEvent>("TaskEvent", taskEventSchema);
export const TaskEventLogModel = model<TaskEventLog>(
	"TaskEventLog",
	taskEventLogSchema,
);
