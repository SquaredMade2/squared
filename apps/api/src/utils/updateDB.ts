import "dotenv/config";
import Workspace from "../models/workspace";
import User from "../models/user";
import Task from "../models/task";
import mongoose from "mongoose";
import IUsersRoles from "../interface/userRoles";
import { Types } from "mongoose";
import { CommentModel as Comment } from "../models/events";
const MONGO_URL = process.env.MONGO_URL;

const updateWorkspaceUsername = async () => {
	const workspaces = await Workspace.find();
	workspaces.forEach(async (workspace) => {
		const newWorkspace: IUsersRoles[] = await Promise.all(
			workspace.users.map(async (user) => {
				const userFound = await User.findOne({ _id: user.user });
				if (userFound) {
					const userId: Types.ObjectId = userFound.id;
					const userRole: IUsersRoles = {
						username: userFound?.name,
						user: userId,
						role: user.role,
					};
					return userRole;
				}
				const emptyUser: IUsersRoles = {
					username: "",
					user: user.user,
					role: "",
				};
				return emptyUser;
			}),
		);
		workspace.users = newWorkspace;
		await Workspace.create(workspace);
	});
};

const updateTaskAssigneeName = async () => {
	const tasks = await Task.find();
	tasks.forEach(async (eachTask) => {
		await Task.findByIdAndUpdate(eachTask.id, {
			$set: { assignee: { id: null, name: null } },
		});
	});
};

const updateTasksWithoutIdentifier = async () => {
	try {
		// Fetch tasks without the 'identifier' field
		const tasksWithoutIdentifier = await Task.find({
			identifier: { $exists: false },
		});

		// Initialize a counter for unique identifier generation
		let identifierCounter = 1;

		// Sequentially update each task
		for (const task of tasksWithoutIdentifier) {
			const newIdentifier = `0${identifierCounter}`; // Generate unique identifier
			await Task.findByIdAndUpdate(task._id, {
				$set: { identifier: newIdentifier },
			});
			identifierCounter++; // Increment counter for the next identifier
		}
	} catch (error) {}
};

// const updateWorkspaceWithRepo = async () => {
//   try {
//     const workspacesWithoutRepo = await Workspace.find({ githubRepoInfo: { $exists: false } })

//     workspacesWithoutRepo.forEach(async (workspace) => {
//       await Workspace.findByIdAndUpdate(workspace._id, { $set: { githubRepoInfo: { repoName: '', owner: '' } } })
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

mongoose.set("strictQuery", false);
mongoose
	.connect(MONGO_URL, { dbName: "test" })
	.then((): void => {
		// updateWorkspaceUsername();
		// updateTaskAssigneeName();
		// updateTasksWithoutIdentifier();
		// updateWorkspaceWithRepo()
	})
	.catch((err: string): void => {});
