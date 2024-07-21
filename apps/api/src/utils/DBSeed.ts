import 'dotenv/config';
import { hashPassword, comparePassword } from '../helpers/auth';
import { CommentModel as Comment } from '../models/events';
import Workspace from '../models/workspace';
import User from '../models/user';
import Task from '../models/task';
import Team from '../models/team';
import NotificationModel from '../models/notification';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
const MONGO_URL = process.env.MONGO_URL;

export const seedDB = async () => {
	const num = faker.number.int({ min: 5, max: 10 });

	for (let i = 0; i < num; i++) {
		const user = await addUser();
		const numWorkspaces = faker.number.int({ min: 1, max: 2 });

		for (let k = 0; k < numWorkspaces; k++) {
			const workspace = await addWorkspace(user);
			const numTeams = faker.number.int({ min: 1, max: 2 });

			for (let j = 0; j < numTeams; j++) {
				const team = await addTeam(workspace, user);
				const numTasks = faker.number.int({ min: 25, max: 40 });

				for (let l = 0; l < numTasks; l++) {
					const task = await addTask(team, workspace, user);
					const numComments = faker.number.int({ min: 0, max: 3 });

					for (let c = 0; c < numComments; c++) {
						const num = faker.number.int({
							min: 0,
							max: workspace.users.length - 1,
						});
						await addComment(workspace.users[num].user, task);
					}
				}
			}
		}
	}
	
	process.exit();
};

const addUser = async () => {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	const fullName = firstName + ' ' + lastName;
	const username = faker.internet.userName({
		firstName: firstName,
		lastName: lastName,
	});
	const password = process.env.SEED_PASSWORD;
	const hashedPassword = await hashPassword(password);
	const email = faker.internet.email({
		firstName: firstName,
		lastName: lastName,
	});
	const user = await User.create({
		name: fullName,
		username: username,
		email: email,
		password: hashedPassword,
		date: Date.now(),
		verified: true,
	});
	return user;
};

const addWorkspace = async (user: any) => {
	const num = faker.number.int({ min: 1, max: 5 });
	const workspaceName = faker.internet.domainWord();
	const workspaceCompanySize = faker.number.int({ max: 1000 });
	let users = [{ user: user, role: 'owner' }];

	for (let i = 0; i < num; i++) {
		let role = faker.helpers.arrayElement(['Admin', 'Member']);
		let newUser = await addUser();
		users.push({ user: newUser, role: role });
	}
	const workspace = await Workspace.create({
		name: workspaceName,
		url: workspaceName,
		companySize: workspaceCompanySize,
		users: users,
		issuesCreated: 1,
	});

	users.forEach(async (user: any) => {
		await User.findByIdAndUpdate(
			user.user,
			{
				$push: { workspaces: workspace._id },
				on_boarding: true,
			},
			{ new: true }
		);
	});
	return workspace;
};

const addTeam = async (workspace: any, user: any) => {
	const teamName = faker.internet.domainWord();
	const teamIdentifier = faker.string.alpha({
		length: { min: 3, max: 3 },
		casing: 'upper',
	});
	const team = await Team.create({
		name: teamName,
		identifier: teamIdentifier,
		workspace,
		users: [user],
	});

	await Workspace.findByIdAndUpdate(workspace._id, {
		$push: { teams: team._id },
	});
	await User.findByIdAndUpdate(user._id, {
		$push: { teams: team._id },
	});

	return team;
};

const addTask = async (team: any, workspace: any, user: any) => {
	const taskTitle = faker.lorem.words({ min: 1, max: 3 });
	const taskDescription = faker.lorem.words({ min: 3, max: 5 });
	const taskStatus = faker.helpers.arrayElement([
		'Backlog',
		'Todo',
		'In Progress',
		'Done',
		'Canceled',
	]);
	const taskPriority = faker.helpers.arrayElement([
		'Urgent',
		'High',
		'Medium',
		'Low',
		'No priority',
	]);
	const taskLabels = faker.helpers.arrayElements(
		['Bug', 'Feature', 'Improvement', 'Red', 'Test'],
		{ min: 0, max: 5 }
	);
	const taskDueDate = faker.date.future();
	const taskEffortEstimate = faker.helpers.arrayElement([
		1, 2, 3, 5, 8, 13, 21,
	]);
	const task = await Task.create({
		authorId: user._id,
		title: taskTitle,
		status: taskStatus,
		description: taskDescription,
		priority: taskPriority,
		labels: taskLabels,
		dueDate: taskDueDate,
		effortEstimate: taskEffortEstimate,
		identifier: team.identifier + '-' + workspace.issuesCreated,
		team,
	});
	await Team.findByIdAndUpdate(team._id, { $push: { tasks: task._id } });
	await Workspace.findByIdAndUpdate(workspace._id, {
		$inc: { issuesCreated: 1 },
	});

	// Add notification
	await addNotification(user, task);

	return task;
};

const addComment = async (user: any, task: any) => {
	const commentContent = faker.lorem.words({ min: 3, max: 5 });
	const commentJson = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"${commentContent}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
	const comment = await Comment.create({
		comment: commentJson,
		author: user,
		date: Date.now(),
		task: task,
	});
	return comment;
};

const addNotification = async (user: any, task: any) => {
	const notification = await NotificationModel.create({
		user: user._id,
		task: [task._id],
		read: faker.datatype.boolean(),
		description: faker.lorem.sentence(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
	});
	return notification;
};

mongoose.set('strictQuery', false);
mongoose
	.connect(MONGO_URL, { dbName: 'test' })
	.then((): void => {
		
		seedDB();
	})
	.catch((err: string): void =>
		
	);
