import { Router } from "express";

import {
	addFilter,
	getSelectedFilters,
	getFilteredTasks,
	deleteView,
} from "../controllers/pageFilterControllers";

const router: Router = Router();

/**
 * @openapi
 * /filter/read/{teamId}:
 *   get:
 *     tags:
 *       - Page Filter Routes
 *     summary: gets the page filters
 *     description: gets the page filters for the specified team
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / page filter was found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageFilter'
 *       '404':
 *         description: Page filter not found
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
router.get("/read/:teamId", getSelectedFilters);
/**
 * @openapi
 * /filter/tasks/{teamId}/{filterId}:
 *   get:
 *     tags:
 *       - Page Filter Routes
 *     summary: gets tasks with the filter applied
 *     description: gets tasks of the specified team with the specified filter applied
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: filterId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / tasks filtered
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Page filters not found
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
router.get("/tasks/:teamId/:filterId", getFilteredTasks);

/**
 * @openapi
 * /filter/create:
 *   post:
 *     tags:
 *       - Page Filter Routes
 *     summary: creates a  page filters
 *     description: creates a page filters / filter description is optional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filterTitle:
 *                 type: string
 *               filterOption:
 *                 type: string
 *               filterDescription:
 *                 type: string
 *               teamId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / page filter created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageFilter'
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
router.post("/create", addFilter);
/**
 * @openapi
 * /tasks/{teamId}/{filterId}:
 *   post:
 *     tags:
 *       - Page Filter Routes
 *     summary: retrieves filtered tasks for the dashboard page
 *     description: retrieves filtered tasks to display on the dashboard page
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: filterId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                  type: array
 *                  items:
 *                   type: string
 *               priority:
 *                  type: array
 *                  items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Successful connection / tasks filtered
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
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
router.post("/tasks/:teamId/:filterId", getFilteredTasks);

/**
 * @openapi
 * /filter/delete/{teamId}/{filterId}:
 *   delete:
 *     tags:
 *       - Page Filter Routes
 *     summary: deletes filter
 *     description: deletes filter and returns new list with filter removed
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: filterId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / filter deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Page filter not found
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
router.delete("/delete/", deleteView);

export default router;
