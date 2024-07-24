import { Schema, model } from "mongoose";
import type IWorkspace from "../interface/workspace";

/**
 * @openapi
 * components:
 *   schemas:
 *     Workspace:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         url:
 *           type: string
 *         companySize:
 *           type: integer
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Team'
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 */

const workspaceSchema = new Schema<IWorkspace>({
  name: {
    type: String,
  },
  url: {
    type: String,
  },
  companySize: {
    type: Number,
  },
  universalTokenLink: {
    token: {
      type: String,
      default: "",
    },
    isEnabled: { type: Boolean, default: true },
  },
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  users: [{ user: { type: Schema.Types.ObjectId, ref: "User" }, role: String, username: { type: String, ref: "User"} }],
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  issuesCreated: {
    type: Number,
  },
  githubRepoInfo: { repoName: { type: String, default: '' }, owner: { type: String, default: '' }}
});

const WorkspaceModel = model<IWorkspace>("Workspace", workspaceSchema);

export default WorkspaceModel;
