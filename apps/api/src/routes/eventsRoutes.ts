import { Router } from "express";
import catchAsync from "../utils/catchAsync";
import {
	addComment,
	getComments,
	updateComment,
	deleteComment,
	createTaskEvent,
	addTaskEvent,
	getTaskEvents,
	getTaskEventLog,
} from "../controllers/eventsControllers";

const router: Router = Router();
/**
 * @openapi
 * /event/comment/read/{taskId}:
 *   get:
 *     tags:
 *       - Event Routes
 *     summary: gets the comment with the id
 *     description: returns the comment with the id in the params of the request
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / correct comment is returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
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
router.get("/comment/read/:taskId", catchAsync(getComments));

/**
 * @openapi
 * /event/comment/create:
 *   post:
 *     tags:
 *       - Event Routes
 *     summary: creates a new comment
 *     description: creates a new comment and returns it
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               author:
 *                 type: string
 *               date:
 *                 type: string
 *               task:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successful connection / comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
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
router.post("/comment/create", catchAsync(addComment));

/**
 * @openapi
 * /event/comment/update:
 *   put:
 *     tags:
 *       - Event Routes
 *     summary: update comment
 *     description: returns the comment after it is update with the information sent in the request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful connection / comment was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
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
router.put("/comment/update", catchAsync(updateComment));

/**
 * @openapi
 * /event/comment/delete/{id}:
 *   delete:
 *     tags:
 *       - Event Routes
 *     summary: Delete comment
 *     description: Deletes comments and sends the confirmation back
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / comment was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                 deletedCount:
 *                   type: integer
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
router.delete("/comment/delete/:id", catchAsync(deleteComment));

router.post("/create-log", catchAsync(createTaskEvent));
router.post("/add", catchAsync(addTaskEvent));
router.get("/read/log/:taskId", catchAsync(getTaskEventLog));
router.get("/read/events/:taskId", catchAsync(getTaskEvents));

export default router;
