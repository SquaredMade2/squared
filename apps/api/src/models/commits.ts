import { Schema, model } from "mongoose";
import type { Commits } from "../interface/commits";

const commitSchema = new Schema<Commits>({
	id: {
		type: String,
		required: true,
	},
	tree_id: {
		type: String,
	},
	distinct: {
		type: Boolean,
	},
	message: {
		type: String,
		required: true,
	},
	timestamp: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	author: {
		name: { type: String },
		email: { type: String },
		username: { type: String },
	},
	committer: {
		name: { type: String },
		email: { type: String },
		username: { type: String },
	},
	added: [{ type: String }],
	removed: [{ type: String }],
	modified: [{ type: String }],
	repoName: {
		type: String,
	},
	owner: {
		type: String,
	},
});

export const CommitModel = model<Commits>("Commit", commitSchema);

export default CommitModel;
