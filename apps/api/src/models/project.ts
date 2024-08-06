import { Schema, model } from "mongoose";
import type IProject from "../interface/project";

/**
 * @openapi
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         team:
 *           $ref: '#/components/schemas/Team'
 */

const projectSchema = new Schema<IProject>({
	name: {
		type: String,
		required: true,
	},
	team: { type: Schema.Types.ObjectId, ref: "Team" },
});

const ProjectModel = model<IProject>("Project", projectSchema);

export default ProjectModel;
