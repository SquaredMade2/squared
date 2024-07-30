import { Schema, model } from "mongoose";
import ITag from "../interface/tag";

/**
 * @openapi
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 */

const tagSchema = new Schema<ITag>({
	name: {
		type: String,
		required: true,
	},
});

const TagModel = model<ITag>("Tag", tagSchema);

export default TagModel;
