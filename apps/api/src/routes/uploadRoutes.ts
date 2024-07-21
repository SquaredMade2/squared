import { Router } from "express";
import { upload, uploadSingleFile } from "../controllers/uploadControllers";
import { deleteSingleFile } from "../controllers/uploadControllers";

const router: Router = Router();

/**
 * @openapi
 * /uploads/image/create:
 *   post:
 *     tags:
 *       - Upload Routes
 *     summary: updates the users role
 *     description: updates the roles of the user in the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               originalName:
 *                 type: string
 *               buffer:
 *                 type: binary
 *     responses:
 *       '200':
 *         description: Successful connection / file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage:
 *                   type: string
 *                 url:
 *                   type: string
 *                 filekey:
 *                    type: string
 *       '500':
 *         description: no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.post(
  "/image/create",
  (req, res, next) => {
    next();
  },
  upload.single("image"),
  uploadSingleFile
);
/**
 * @openapi
 * /uploads/image/delete/{imageKey}:
 *   delete:
 *     tags:
 *       - Upload Routes
 *     summary: deletes uploaded image 
 *     description: stores image file in an AWS s3 bucket
 *     parameters:
 *       - name: imageKey
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection/ file deleted
 *         content:
 *               type: object
 *               properties:
 *                 message:
 *                   type: boolean
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
router.delete("/image/delete/:imageKey", (req, res) => {
  if (typeof req.params.imageKey === "string") {
    const imageKey = req.params.imageKey;
    deleteSingleFile(imageKey)
      .then(() =>
        res.status(200).send({ message: "Image deleted successfully" })
      )
      .catch((err) => {
        
        res.status(500).send({ error: "Failed to delete image" });
      });
  }
});
export default router;
