import { Router } from "express";
import {
  addWorkspace,
  getWorkspace,
  deleteWorkspace,
  updateWorkspace,
  getAllWorkspaces,
  workspaceExists,
  joinWorkspace,
  verifyTokenToJoinWorkspace,
  updateUserRoles,
  removeUserFromWorkspace,
  createTokenLink,
  joinWorkspaceThroughUniversalLink,
  enableUniversalLink,
  searchQuery,
  incrementWorkspaceCreatedIssues,
  setGithubRepo,
} from "../controllers/workspaceControllers";
// import catchAsync from "../utils/catchAsync";
const router: Router = Router();

/**
 * @openapi
 * /workspace/read:
 *   get:
 *     tags:
 *       - Workspace Routes
 *     summary: gets all tasks for a team
 *     description: gets one workspace for a user/ must use either url or id
 *     parameters:
 *       - name: url
 *         in: query
 *         schema:
 *           type: string
 *       - name: id
 *         in: query
 *         schema:
 *           type: string
 *       - name: user
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / workspace found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/read", getWorkspace);
/**
 * @openapi
 * /workspace/read-all:
 *   get:
 *     tags:
 *       - Workspace Routes
 *     summary: gets all the workspaces for a user
 *     description: gets all the workspaces for a user
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / Workspaces found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspaces not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/read-all", getAllWorkspaces);
/**
 * @openapi
 * /workspace/exists:
 *   get:
 *     tags:
 *       - Workspace Routes
 *     summary: checks to see it workspace already exists
 *     description: checks to see it workspace already exists
 *     parameters:
 *       - name: url
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / Workspace does not exist and new one can be created
 *       '409':
 *         description: Workspace already exists
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/exists", workspaceExists);
/**
 * @openapi
 * /workspace/searchQuery:
 *   get:
 *     tags:
 *       - Workspace Routes
 *     summary: searches workspace and tasks
 *     description: searches workspace for taskes that include searched query
 *     parameters:
 *       - name: workspace
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/searchQuery", searchQuery);

/**
 * @openapi
 * /workspace/accept/{token}:
 *   get:
 *     tags:
 *       - Workspace Routes
 *     summary: adds user to workspace
 *     description: adds user to the workspace with the corrosponding universal token
 *     parameters:
 *       - name: token
 *         in: path
 *         schema:
 *           type: string
 *       - name: token
 *         in: header
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / added to workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedWorkspace:
 *                     $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/accept/:token", joinWorkspaceThroughUniversalLink);
/**
 * @openapi
 * /workspace/join/{token}:
 *   get:
 *     tags:
 *       - Workspace Routes
 *     summary: adds user to workspace
 *     description: adds a user to the workspace using a token
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / added to workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedWorkspace:
 *                     $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '422':
 *         description: Unprocessable Content
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '498':
 *         description: expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/join/:token", verifyTokenToJoinWorkspace);
/**
 * @openapi
 * /workspace/create:
 *   post:
 *     tags:
 *       - Workspace Routes
 *     summary: Creates workspace
 *     description: Creates workspace and added the workspaces at all the users passed into as params
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               companySize:
 *                 type: string
 *               users:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successful connection / Workspace created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workspace:
 *                   $ref: '#/components/schemas/Workspace'
 *                 users:
 *                   $ref: '#/components/schemas/User'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/create", addWorkspace);
/**
 * @openapi
 * /workspace/join-workspace:
 *   post:
 *     tags:
 *       - Workspace Routes
 *     summary: adds user to workspace
 *     description: adds a user, that is found by email, to the workspace, that is found by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / added to workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedWorkspace:
 *                     $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/join-workspace", joinWorkspace);
/**
 * @openapi
 * /workspace/create-token-link:
 *   post:
 *     tags:
 *       - Workspace Routes
 *     summary: creates a token link for a workspace
 *     description: creates a token link for a workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / link created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 workspace:
 *                   type: string
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '422':
 *         description: user doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/create-token-link", createTokenLink);
/**
 * @openapi
 * /workspace/enable-workspace-link:
 *   post:
 *     tags:
 *       - Workspace Routes
 *     summary: enables or disables workspace invite link
 *     description: sets enabled status on workspace link to either true or false based on what was passed in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *               workspaceId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / link enabled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isEnabled:
 *                   type: boolean
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/enable-workspace-link", enableUniversalLink);

/**
 * @openapi
 * /workspace/update:
 *   put:
 *     tags:
 *       - Workspace Routes
 *     summary: updates the workspace
 *     description: updates the workspace
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: url
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / Workspace updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/update", updateWorkspace);
/**
 * @openapi
 * /workspace/update/incrementIssues:
 *   put:
 *     tags:
 *       - Workspace Routes
 *     summary: Increments workspace issues by 1
 *     description: Called when a new issue is created. This endpoint will increment the createdIssues parameter by 1.
 *     parameters:
 *       - name: id
 *         in: query  # Updated from 'path' to 'query'
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/update/incrementIssues", incrementWorkspaceCreatedIssues);
/**
 * @openapi
 * /workspace/update-role:
 *   put:
 *     tags:
 *       - Workspace Routes
 *     summary: updates the users role
 *     description: updates the roles of the user in the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / role updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedWorkspace:
 *                     $ref: '#/components/schemas/Workspace'
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/update-role", updateUserRoles);

/**
 * @openapi
 * /workspace/delete/{id}:
 *   delete:
 *     tags:
 *       - Workspace Routes
 *     summary: Deletes workspace
 *     description: Deletes Workspace and removes it from User, Task, Team workspace properties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               teamIds:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / Workspace deleted
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/delete", deleteWorkspace);
/**
 * @openapi
 * /workspace/delete-user:
 *   delete:
 *     tags:
 *       - Workspace Routes
 *     summary: removes user from workspace
 *     description: removed user from the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / role updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '404':
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/delete-user", removeUserFromWorkspace);

router.post("/setGithubRepo", setGithubRepo) 

export default router;
