import { Schema, model } from "mongoose";
import IStatus from "../interface/status";

/**
 * @openapi
 * components:
 *   schemas:
 *     Status:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - ACTIVE
 *             - DONE
 *             - DELIVERED
 */

const statusSchema = new Schema<IStatus>({
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "DONE", "DELIVERED"],
    default: "PENDING",
  },
});

const StatusModel = model<IStatus>("Status", statusSchema);

export default StatusModel;
