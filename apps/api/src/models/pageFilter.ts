import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * @openapi
 * components:
 *   schemas:
 *     PageFilter:
 *       type: object
 *       required:
 *         - filterTitle
 *         - filerOptions
 *         - filterDecr
 *       properties:
 *         filterTitle:
 *           type: string
 *         filterOption:
 *           type: object
 *         filterDescription:
 *           type: string
 *         teamId:
 *           $ref: '#/components/schemas/Team'
 */

export const pageFilterSchema = new Schema({
  filterTitle: {
    type: String,
    required: true,
  },
  filterOption: {
    type: Object,
    required: true,
  },
  filterDescription: {
    type: String,
    required: false,
  },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },

  // leave comments in - Filters will be associated with project id as a feature.
  // project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

const PageFilterModel = mongoose.model("PageFilterModel", pageFilterSchema);

export default PageFilterModel;
