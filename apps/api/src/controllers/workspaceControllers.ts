import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AppError from "../utils/AppError";
import Workspace from "../models/workspace";
import User from "../models/user";
import Task from "../models/task";
import Team from "../models/team";
import { sendMail } from "../helpers/transporter";
import jwt from "jsonwebtoken";
import type JWTPayload from "../interface/JWTPayload";
import {
	getLookup,
	tasksOfTeamFields,
	userOfWorkspaceField,
	workspaceGroup,
} from "../utils/aggregationUtils";
import type IWorkspace from "../interface/workspace";
const crypto = require("node:crypto");

const addWorkspace = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { name, url, companySize, users, username } = req.body;
		// Create new workspace
		const workspace = await Workspace.create({
			name,
			url,
			companySize,
			users: { username, user: users, role: "owner" },
			issuesCreated: 1,
		});
		// Update user with new workspace make onboarding true and return updated user
		const user = await User.findByIdAndUpdate(
			users,
			{
				$push: {
					workspaces: workspace._id,
				},
				on_boarding: true,
			},
			{ new: true },
		);
		if (!user) {
			return next(new AppError("$$$ User not found $$$", 404));
		}
		res.status(201).json({ workspace, user });
	} catch (error) {
		return next(
			new AppError("$$$ An error occurred while adding the workspace.", 500),
		);
	}
};

const getWorkspace = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { url, id, user } = req.query;
	let workspace: IWorkspace[];
	if (!url && !id) {
		return next(new AppError("$$$ No workspace id or url provided $$$", 404));
	}
	if (!id && typeof user === "string" && typeof url === "string") {
		workspace = await Workspace.aggregate([
			{
				$match: {
					url: url,
					"users.user": new Types.ObjectId(user),
				},
			},

			getLookup("teams", "teams", "_id", "teams"),

			{
				$unwind: { path: "$teams", preserveNullAndEmptyArrays: true },
			},

			getLookup("tasks", "teams.tasks", "_id", "teams.tasks"),

			tasksOfTeamFields,

			workspaceGroup,

			getLookup("users", "users.user", "_id", "userDetails"),

			userOfWorkspaceField,
		]);
		if (!workspace) {
			return next(new AppError("$$$ Workspace not found $$$", 404));
		}
		res.json(workspace[0]);
	} else if (typeof id === "string" && typeof user === "string") {
		workspace = await Workspace.aggregate([
			{
				$match: {
					_id: new Types.ObjectId(id),
					"users.user": new Types.ObjectId(user),
				},
			},
			getLookup("teams", "teams", "_id", "teams"),

			{
				$unwind: { path: "$teams", preserveNullAndEmptyArrays: true },
			},

			getLookup("tasks", "teams.tasks", "_id", "teams.tasks"),

			tasksOfTeamFields,

			workspaceGroup,

			getLookup("users", "users.user", "_id", "userDetails"),

			userOfWorkspaceField,
		]);
		if (!workspace) {
			return next(new AppError("$$$ Workspace not found $$$", 404));
		}
		res.json(workspace[0]);
	}
};

const createTokenLink = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { id } = req.body;

	try {
		const workspace = await Workspace.findOne({ _id: id });
		if (!id) {
			return next(new AppError("User with that email does not exist", 422));
		}
		if (!workspace) {
			return next(new AppError("Workspace does not exist", 404));
		}
		workspace.universalTokenLink.token = await crypto
			.randomBytes(16)
			.toString("hex")
			.replace(/-/g, "")
			.substring(0, 16);
		await workspace.save();
		res.json({
			success: true,
			message: "Successfully created new token",
			workspace: workspace.universalTokenLink.token,
		});
	} catch (error) {}
};

const enableUniversalLink = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { enabled, workspaceId } = req.body;
	try {
		const workspace = await Workspace.findByIdAndUpdate(
			workspaceId,
			{ "universalTokenLink.isEnabled": enabled },
			{ new: true },
		);
		if (!workspace) {
			return next(new AppError("Could not find workspace.", 404));
		}
		res.json({ success: true, isEnabled: enabled });
	} catch (error) {
		return next(new AppError("Internal Server Error", 500));
	}
};

const joinWorkspaceThroughUniversalLink = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { token } = req.params;
	try {
		const userToken = req.cookies.token;
		if (!userToken) {
			return next(new AppError("User is not logged in", 404));
		}
		const decoded = jwt.verify(
			userToken,
			process.env.JWT_SECRECT,
		) as JWTPayload;

		const user = await User.findById({ _id: decoded.id });
		const workspace = await Workspace.findOne({
			"universalTokenLink.token": token,
		});
		const userExists = workspace?.users.some(
			(u) => u.user.toString() === user?._id.toString(),
		);
		if (userExists) {
			return next(new AppError("User already exists in workspace", 404));
		}

		if (!workspace) {
			return next(new AppError("Workspace not found", 404));
		}
		if (!user) {
			return next(new AppError("User is not logged in", 404));
		}
		if (!workspace.universalTokenLink.isEnabled) {
			return next(
				new AppError("Invitation link is not enabled currently", 404),
			);
		}

		const updatedWorkspace = await Workspace.findByIdAndUpdate(
			workspace._id,
			{
				$push: {
					users: {
						username: user.username,
						user: user._id,
						role: "member",
					},
				},
			},
			{ new: true },
		).populate({ path: "teams", populate: { path: "tasks" } });

		if (updatedWorkspace) {
			const updatedWorkspaceWithTransformedDates = await Workspace.aggregate([
				{ $match: { _id: updatedWorkspace._id } },
				getLookup("teams", "teams", "_id", "teams"),
				{
					$unwind: {
						path: "$teams",
						preserveNullAndEmptyArrays: true,
					},
				},
				getLookup("tasks", "teams.tasks", "_id", "teams.tasks"),
				tasksOfTeamFields,
				workspaceGroup,
				getLookup("users", "users.user", "_id", "userDetails"),
				userOfWorkspaceField,
			]);

			await User.findByIdAndUpdate(
				user._id,
				{
					$push: { workspaces: updatedWorkspace },
				},
				{ new: true },
			);

			res.json({
				success: true,
				message: "Accepted workspace",
				updatedWorkspaceWithTransformedDates,
			});
			await user.save();
		}
	} catch (error) {
		return next(new AppError("Internal Server Error", 500));
	}
};

const joinWorkspace = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { id, email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!id || !user) {
			return next(new AppError("User with that email does not exist", 422));
		}
		if (user.workspaces.includes(id)) {
			return res.json({
				error: "User is already a member of workspace",
			});
		}
		const workspace = await Workspace.findOne({ _id: id });
		const token = jwt.sign(
			{ user: user._id, workspaceId: id },
			process.env.JWT_SECRECT,
			{ expiresIn: "1h" },
		);
		if (!workspace) {
			return next(new AppError("Workspace does not exist", 404));
		}

		let tokenExistsInWorkspace = false;
		user.join_workspace = user.join_workspace.map((work) => {
			try {
				const decoded = jwt.verify(work, process.env.JWT_SECRECT) as JWTPayload;
				if (decoded.workspaceId === id) {
					tokenExistsInWorkspace = true;
					return token;
				}
				return work;
			} catch (error) {
				return work;
			}
		});

		if (!tokenExistsInWorkspace) {
			user.join_workspace.push(token);
		}
		await workspace.save();
		await user.save();
		sendMail(email, user.username, token, "join", "workspace", workspace?.name);
		res.json({
			success: true,
			message: "Workspace Invitation sent!",
			token,
		});
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const verifyTokenToJoinWorkspace = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { token } = req.params;
	if (!token) {
		return res.status(422).send({ message: "Missing token" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRECT) as JWTPayload;
		const user = await User.findById(decoded.user);
		if (!user) {
			return next(new AppError("No User is found with that email", 422));
		}
		const tokenIndex = user.join_workspace.indexOf(token);
		if (tokenIndex === -1) {
			return next(
				new AppError("Link has been expired. Please try a new invitation", 498),
			);
		}
		const workspaceId = decoded.workspaceId;
		const workspace = await Workspace.findOne({ _id: workspaceId });
		if (!workspace) {
			return next(new AppError("No workspace found", 404));
		}
		const updatedWorkspace = await Workspace.findByIdAndUpdate(
			workspace.id,
			{
				$push: {
					users: {
						username: user.username,
						user: user._id,
						role: "member",
					},
				},
			},
			{ new: true },
		).populate({
			path: "teams",
			populate: { path: "tasks" },
		});

		user.join_workspace.splice(Number(tokenIndex), 1);
		await User.findByIdAndUpdate(
			user._id,
			{
				$push: { workspaces: updatedWorkspace },
				on_boarding: true,
			},
			{ new: true },
		);

		if (updatedWorkspace) {
			const updatedWorkspaceWithTransformedDates = await Workspace.aggregate([
				{ $match: { _id: updatedWorkspace._id } },
				getLookup("teams", "teams", "_id", "teams"),
				{
					$unwind: {
						path: "$teams",
						preserveNullAndEmptyArrays: true,
					},
				},
				getLookup("tasks", "teams.tasks", "_id", "teams.tasks"),
				tasksOfTeamFields,
				workspaceGroup,
				getLookup("users", "users.user", "_id", "userDetails"),
				userOfWorkspaceField,
			]);
			res.json({
				success: true,
				message: "Workspace joined successfully",
				workspace: updatedWorkspaceWithTransformedDates,
			});
		}
		await user.save();
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			res.status(401).json({ error: "Token has been expired" });
		}
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteWorkspace = async (req: Request, res: Response): Promise<void> => {
	const { id, teamIds, userId } = req.body;
	try {
		const workspace = await Workspace.findOne({ _id: id });
		if (!workspace) {
			res.status(404).send("Workspace not found");
			return;
		}
		const isWorkspaceOwner = workspace.users.some(
			(user) =>
				user.user.toString() === userId.toString() && user.role === "owner",
		);
		if (isWorkspaceOwner) {
			await Task.deleteMany({ team: { $in: teamIds } });
			await Team.deleteMany({ workspace: id });
			await Workspace.deleteOne({ _id: id });
			await User.updateMany({}, { $pull: { workspaces: id } });
			res.json({
				success: true,
				message: "Successfully deleted workspace!",
			});
		} else {
			await Workspace.findByIdAndUpdate(id, {
				$pull: { users: { user: userId } },
			});
			await User.findByIdAndUpdate(userId, {
				$pull: { workspaces: id },
			});
			res.json({
				success: true,
				message: "Successfully left the workspace!",
			});
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
};

const getAllWorkspaces = async (req: Request, res: Response): Promise<void> => {
	const id = req.query.id;
	const workspaceData = await User.find({ _id: id }).populate("workspaces");
	const workspace = workspaceData[0].workspaces;
	res.json(workspace);
};

const updateWorkspace = async (req: Request, res: Response): Promise<void> => {
	const { id, name, url } = req.query;
	await Workspace.updateOne({ _id: id }, { $set: { name: name, url: url } });
	res.sendStatus(200);
};

const incrementWorkspaceCreatedIssues = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { id } = req.query;
	await Workspace.updateOne({ _id: id }, { $inc: { issuesCreated: 1 } });
	res.sendStatus(200);
};

const workspaceExists = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { url } = req.query;
	const exists = await Workspace.findOne({ url });	
	if (exists) {
		return next(new AppError("$$$ Workspace already exists. $$$", 404));
	}
	res.sendStatus(200);
};

const updateUserRoles = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { userId, workspaceId, role } = req.body;
	try {
		const workspace = await Workspace.findOne({ _id: workspaceId });
		if (!workspace) {
			return next(new AppError("$$$ No Workspace found $$$", 404));
		}
		const updatedUserWorkspace = workspace?.users.map((user) => {
			if (user.user.toString() === userId.toString()) {
				user.role = role;
			}
			return user;
		});

		await Workspace.findByIdAndUpdate(
			{ _id: workspaceId },
			{
				$set: { users: updatedUserWorkspace },
			},
			{ new: true },
		);
		res.json({
			success: true,
			message: "Updated the role",
			updatedUserWorkspace,
		});
	} catch (err) {
		return next(new AppError("Internal Server Error", 500));
	}
};

const removeUserFromWorkspace = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { workspaceId, userId } = req.body;
	try {
		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			res.status(404).send("Workspace not found");
		}

		if (
			!workspace?.users.some(
				(user) => user.user.toString() === userId.toString(),
			)
		) {
			res.status(404).send("User not part of workspace");
		}

		const updatedWorkspace = await Workspace.findByIdAndUpdate(
			workspaceId,
			{
				$pull: { users: { user: userId } },
			},
			{ new: true },
		);
		await User.findByIdAndUpdate(userId, {
			$pull: { workspaces: workspaceId },
		});
		res.json({
			success: true,
			message: "User successfully removed from workspace",
		});
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
};
const searchQuery = async (req: Request, res: Response) => {
	const { workspace } = req.query;
	const query = req.query.query as string;

	const workspaceLookup: IWorkspace[] = await Workspace.aggregate([
		{
			$match: {
				_id:
					typeof workspace === "string"
						? new Types.ObjectId(workspace)
						: workspace,
			},
		},
		getLookup("teams", "teams", "_id", "teams"),

		{ $unwind: { path: "$teams", preserveNullAndEmptyArrays: true } },

		getLookup("tasks", "teams.tasks", "_id", "teams.tasks"),

		tasksOfTeamFields,

		workspaceGroup,

		getLookup("users", "users.user", "_id", "userDetails"),

		userOfWorkspaceField,
	]);
	const processedData = workspaceLookup.map((workspace) =>
		workspace.teams.map((team) =>
			team.tasks.filter((task) => task.title.toLowerCase().includes(query)),
		),
	);
	const flattenedData = processedData.flat(Number.POSITIVE_INFINITY);
	res.json(flattenedData);
};

const setGithubRepo = async (req: Request, res: Response): Promise<void> => {
	const { workspaceId, repoName, owner } = req.query;
	try {
		await Workspace.findByIdAndUpdate(
			{ _id: workspaceId },
			{
				$set: { githubRepoInfo: { repoName, owner } },
			},
		);
		res.json({ repoName, owner });
	} catch (error) {}
};

export {
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
};
