import { Router } from "express";
import {
  addTeam,
  getTeam,
  deleteTeam,
  updateTeam,
  getTeamInfo,
  teamExists,
} from "../controllers/teamControllers";

const router: Router = Router();
/**
 * @openapi
 * /team/read:
 *   get:
 *     tags:
 *       - Team Routes
 *     summary: gets the specified team
 *     description: gets the specified team
 *     parameters:
 *       - name: team
 *         in: query
 *         schema:
 *           type: string
 *       - name: identifier
 *         in: query
 *         schema:
 *           type: string
 *       - name: workspace
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / team found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       '404':
 *         description: Team not found
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
router.get("/read", getTeam);
/**
 * @openapi
 * /team/getTeamInfo:
 *   get:
 *     tags:
 *       - Team Routes
 *     summary: gets teams with the corrosponding info
 *     description: gets teams with the corrosponding info
 *     parameters:
 *       - name: teamIdArray
 *         in: query
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       '200':
 *         description: Successful connection / teams found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
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
router.get("/getTeamInfo", getTeamInfo);

/**
 * @openapi
 * /team/exists:
 *   post:
 *     tags:
 *       - Team Routes
 *     summary: checks if team exists
 *     description: checks if team exists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               identifier:
 *                 type: string
 *               workspace:
 *                 type: string
 *     responses:
 *       '204':
 *         description: Successful connection / Team exists
*       '409':
 *         description: conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *                 field:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.post("/exists", teamExists);
/**
 * @openapi
 * /team/create:
 *   post:
 *     tags:
 *       - Team Routes
 *     summary: Creates Team
 *     description: Creates team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               identifier:
 *                 type: string
 *               workspace:
 *                 type: string
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Successful connection / Team Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
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
router.post("/create", addTeam);

/**
 * @openapi
 * /team/update:
 *   post:
 *     tags:
 *       - Team Routes
 *     summary: updates Team
 *     description: Updates Team with new information
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: identifier
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / Team updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       '404':
 *         description: Team not found
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
router.put("/update", updateTeam);

/**
 * @openapi
 * /team/delete/{id}:
 *   delete:
 *     tags:
 *       - Team Routes
 *     summary: deletes Team
 *     description: deletes the specified Team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / Team deleted
 *       '404':
 *         description: Team not found
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
router.delete("/delete", deleteTeam);


export default router;
