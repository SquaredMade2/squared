import { Router } from "express";
import {
  addTask,
  getTask,
  deleteTask,
  updateTask,
  getSingleTask,
  updateTaskAfterDrag,
  updateTaskAssignee,
  getSingleTaskIdentifier,
} from "../controllers/taskControllers";

const router: Router = Router();
/**
 * @openapi
 * /task/read:
 *   get:
 *     tags:
 *       - Task Routes
 *     summary: gets all tasks for a team
 *     description: accepts a query and get all the tasks for that team
 *     parameters:
 *       - name: team
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / tasks found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Tasks not found
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
router.get("/read", getTask);
/**
 * @openapi
 * /task/read/{id}:
 *   get:
 *     tags:
 *       - Task Routes
 *     summary: gets the specified task
 *     description: gets the specified tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
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
router.get("/read/:id", getSingleTask);
/**
 * @openapi
 * /task/readreadIdentifier:
 *   get:
 *     tags:
 *       - Task Routes
 *     summary: gets the specified task
 *     description: gets the specified tasks
 *     parameters:
 *       - name: identifier
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: url
 *       in: query
 *       required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
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
router.get("/readIdentifier", getSingleTaskIdentifier);

/**
 * @openapi
 * /task/create:
 *   post:
 *     tags:
 *       - Task Routes
 *     summary: creates a task
 *     description: creates a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               labels:
 *                 type: string
 *               team:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successful connection / task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
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
router.post("/create", addTask);

/**
 * @openapi
 * /task/update/{id}:
 *   put:
 *     tags:
 *       - Task Routes
 *     summary: Updates task
 *     description: Updates the specified task
 *     parameters:
 *       - name: id
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
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               labels:
 *                 type: string
 *               dueDate:
 *                 type: Date
 *               effortEstimate:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Successful connection / task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
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
router.put("/update/:id", updateTask);
/**
 * @openapi
 * /task/update-drag:
 *   put:
 *     tags:
 *       - Task Routes
 *     summary: updates the task after it is dragged
 *     description: updates the task after it is dragged to a new status. This will only update the status of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '404':
 *         description: Task not found
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
router.put("/update-drag/", updateTaskAfterDrag);
/**
 * @openapi
 * /task/update-assignee:
 *   put:
 *     tags:
 *       - Task Routes
 *     summary: updates assignee
 *     description: updates assignee on a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *               assignee:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / assignee updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 name:
 *                   type: string
 *                 id:
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
router.put("/update-assignee", updateTaskAssignee);

/**
 * @openapi
 * /task/delete/{id}:
 *   delete:
 *     tags:
 *       - Task Routes
 *     summary: deletes Task
 *     description: deletes the specified Task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / task deleted
 *       '404':
 *         description: Task not found
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
router.delete("/delete", deleteTask);
export default router;
