import { Router } from "express";
import {
	registerUser,
	loginUser,
	getProfile,
	logoutUser,
	getUser,
	updateProfile,
	verifyEmail,
	signInUsingNextAuth,
	getAllUsers,
	forgotPassword,
	resetPassword,
	// getGithubAccessToken,
} from "../controllers/authContollers";

const router: Router = Router();

/**
 * @openapi
 * /profile:
 *   get:
 *     tags:
 *       - Authentication Routes
 *     summary: gets the user profile
 *     description: 'reads the cookie token sent in the header of the request, verifies the token and returns the profile of the user '
 *     parameters:
 *       - name: cookie
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful connection / user profile is returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '403':
 *         description: Access denied
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
router.get("/profile", getProfile);
/**
 * @openapi
 *   /user:
 *     get:
 *       tags:
 *         - Authentication Routes
 *       summary: gets the user profile
 *       description: gets the users profile from the id in the query
 *       parameters:
 *         - name: id
 *           in: query
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successful connection / returns user
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '404':
 *           description: user not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.get("/user", getUser);
/**
 * @openapi
 *   /getAllUsers:
 *     get:
 *       tags:
 *         - Authentication Routes
 *       summary: gets all users of a given workspace
 *       description: returns all the users who are members of the given workspace
 *       parameters:
 *         - name: workspaceId
 *           in: query
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successful connection / returns all workspace users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                  $ref: '#/components/schemas/User'
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.get("/getAllUsers", getAllUsers);
/**
 * @openapi
 *   /confirmation/{token}:
 *     get:
 *       tags:
 *         - Authentication Routes
 *       summary: Verifies user account
 *       description: verifies user account using a verification email sent to them
 *       parameters:
 *         - name: token
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successful connection / user email verified
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '404':
 *          description: User does not exists
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.post("/confirmation/:token", verifyEmail);

/**
 * @openapi
 *   /register:
 *     post:
 *       tags:
 *         - Authentication Routes
 *       summary: Creates a new user
 *       description: vaildates the user information and created their account
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Successful connection / user information was validated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '422':
 *           description: Failed to validate user information
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.post("/register", registerUser);
/**
 * @openapi
 *   /login:
 *     post:
 *       tags:
 *         - Authentication Routes
 *       summary: logs in the user
 *       description: authenticates the user information and authorizes them to the site
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Successful connection / user information was validated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '422':
 *           description: Failed to validate user information
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.post("/login", loginUser);
/**
 * @openapi
 *   /logout:
 *     post:
 *       tags:
 *         - Authentication Routes
 *       summary: logs the user out
 *       description: Clears the cookies for the user
 *       responses:
 *         '200':
 *           description: Successful connection / user logged out
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.post("/logout", logoutUser);
/**
 * @openapi
 *   /signInUsingNextAuth:
 *     post:
 *       tags:
 *         - Authentication Routes
 *       summary: logs in the user
 *       description: uses nextAuth to log in the user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Successful connection / user logged in
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '422':
 *           description: no user or not verified
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.post("/signInUsingNextAuth", signInUsingNextAuth);
/**
 * @openapi
 *   /password/reset:
 *     post:
 *       tags:
 *         - Authentication Routes
 *       summary: allows the user to reset their password
 *       description: generates an email to send to the user with a link to reset their password
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Successful connection / email sent
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '422':
 *           description: no email provided
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.post("/password/reset", forgotPassword);
/**
 * @openapi
 *   /password/{token}:
 *     post:
 *       tags:
 *         - Authentication Routes
 *       summary: resets the users password
 *       description: uses the token generated for the user to reset their password
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newPassword:
 *                   type: string
 *       parameters:
 *         - name: token
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successful connection / password reset
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   messsage:
 *                     type: string
 *         '400':
 *           description: invalid/expired token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '422':
 *           description: no token or password provided
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.post("/password/:token", resetPassword);

/**
 * @openapi
 *   /updateProfile:
 *     put:
 *       tags:
 *         - Authentication Routes
 *       summary: updates the users profile
 *       description: updates the user profile with the information sent in the request, can update username and name
 *       parameters:
 *         - name: id
 *           in: query
 *           required: true
 *           schema:
 *             type: string
 *         - name: username
 *           in: query
 *           schema:
 *             type: string
 *         - name: name
 *           in: query
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successful connection / user information was updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
router.put("/updateProfile", updateProfile);

// router.get("/getGithubAccessToken", getGithubAccessToken);

export default router;
