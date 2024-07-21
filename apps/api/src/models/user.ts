import { Schema, model } from "mongoose";
import IUser from "../interface/user";
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - last_login
 *         - on_boarding
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         last_login:
 *           type: string
 *         on_boarding:
 *           type: boolean
 *         default_workspace:
 *           $ref: '#/components/schemas/Workspace'
 *         workspaces:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Workspace'
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Team'
 */

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  last_login: {
    type: Date,
    default: Date.now,
    required: true,
  },
  on_boarding: {
    type: Boolean,
    default: false,
    required: true,
  },
  default_workspace: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    default: null,
  },
  join_workspace: {
    type: [String],
    default: [],
  },
  workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }]
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
