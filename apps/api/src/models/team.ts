import { Schema, model } from "mongoose";
import type ITeam from "../interface/team";
/**
 * @openapi
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       required:
 *         - identifier
 *         - workspace
 *       properties:
 *         name:
 *           type: string
 *         identifier:
 *           type: string
 *         workspace:
 *           $ref: '#/components/schemas/Workspace'
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 */

const teamSchema = new Schema<ITeam>({
	name: {
		type: String,
	},
	identifier: {
		type: String,
		required: true,
	},
	workspace: {
		type: Schema.Types.ObjectId,
		ref: "Workspace",
		required: true,
	},
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	tasks: [
		{
			type: Schema.Types.ObjectId,
			ref: "Task",
		},
	],
});

const TeamModel = model<ITeam>("Team", teamSchema);

export default TeamModel;
