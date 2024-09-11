import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	Access,
	GithubRepo,
	TaskDataState,
	Team,
} from "./taskData.interfaces";
import type { Priority, Status } from "@repo/db";
import {
	addWorkspace,
	createNewTask,
	createTeam,
	createWorkspaceLinkToken,
	deleteAllTasks,
	deleteTask,
	deleteTeam,
	deleteWorkspace,
	enableUniversalLink,
	getAllTasks,
	getAllUsers,
	getAllWorkspaces,
	getCommitsByRepo,
	getTeam,
	getWorkspace,
	incrementCreatedIssues,
	joiningWorkspaceVerification,
	joinWorkspace,
	searchTasks,
	setAssignee,
	setRepo,
	teamExists,
	workspaceExists,
} from "@/store/taskData/thunks";
import type { Workspace, Commit } from "@repo/db";
import type { Task } from "@/storeZ";

const initialState: TaskDataState = {
	taskList: [],
	taskPage: {
		id: "",
		title: "",
		status: "todo",
		identifier: "",
		priority: "noPriority",
		labels: [],
		dueDate: new Date(),
		effortEstimate: null,
		description: "",
		teamId: "",
		assigneeName: "",
		assigneeId: "",
		dateCreated: new Date(),
		authorId: "",
		displayOrder: 0,
	},
	loadingState: "",
	workspaces: [],
	currentWorkspace: {
		companySize: 0,
		name: "",
		url: "",
		id: "",
		universalTokenLinkId: "",
		issuesCreated: 1,
		githubRepoInfoId: "",
		avatarUrl: "",
	},
	currentTeam: {
		identifier: "",
		name: "",
		tasks: [],
		workspace: "",
		_id: "",
		users: [],
	},
	allUsersInWorkspace: [],
	prevWorkspaceUrl: "",
	access: {
		status: false,
		id: "",
	},
	error: false,
	status: "todo",
	priority: "noPriority",
	labels: [],
	dueDate: new Date(),
	effortEstimate: null,
	isLoading: false,
	currentCommits: [],
};

const taskData = createSlice({
	name: "taskData",
	initialState: initialState,
	reducers: {
		setTaskList(state, action: PayloadAction<Task[]>) {
			state.taskList = action.payload;
		},
		setTaskPage(state, action: PayloadAction<Task>) {
			state.taskPage = action.payload;
		},
		setStatus(state, action: PayloadAction<Status>) {
			state.status = action.payload;
		},
		setPriority(state, action: PayloadAction<Priority>) {
			state.priority = action.payload;
		},
		setLabels(state, action: PayloadAction<string[]>) {
			state.labels = action.payload;
		},
		setDueDate(state, action: PayloadAction<Date>) {
			state.dueDate = action.payload;
		},
		setEffortEstimate(state, action: PayloadAction<number | null>) {
			state.effortEstimate = action.payload;
		},
		getTasksError(state) {
			state.error = true;
		},
		setTask(state, action) {
			state.taskPage = action.payload;
		},
		setWorkspace(state, action: PayloadAction<Workspace[]>) {
			state.workspaces = action.payload;
		},
		incrementWorkspaceIssues(state) {
			if (state.currentWorkspace.issuesCreated !== null) {
				if (state.currentWorkspace.issuesCreated !== null) {
					state.currentWorkspace.issuesCreated += 1;
				} else {
					state.currentWorkspace.issuesCreated = 1;
				}
			} else {
				state.currentWorkspace.issuesCreated = 1;
			}
		},
		getWorkspaceSuccess(state, action: PayloadAction<Workspace>) {
			state.error = false;
			state.currentWorkspace = action.payload;
		},
		getWorkspaceFailure(state) {
			state.access.status = false;
			state.error = true;
		},
		setCurrentTeam(state, action: PayloadAction<Team>) {
			state.currentTeam = action.payload;
		},
		getTeamSuccess(state) {
			state.error = false;
		},
		getTeamFailure(state) {
			state.access.status = false;
			state.error = true;
		},
		setAccessId(state, action: PayloadAction<Access>) {
			state.access = action.payload;
		},
		clearCommits(state) {
			state.currentCommits = [];
		},
		disconnectGithubRepo(state) {
			state.currentWorkspace.githubRepoInfoId = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createNewTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createNewTask.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(createNewTask.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(deleteAllTasks.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteAllTasks.fulfilled, (state) => {
				state.isLoading = false;
				state.taskList = [];
			})
			.addCase(deleteAllTasks.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(getAllTasks.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				getAllTasks.fulfilled,
				(state, action: PayloadAction<Task[]>) => {
					state.isLoading = false;
					state.taskList = action.payload;
				},
			)
			.addCase(getAllTasks.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(addWorkspace.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				addWorkspace.fulfilled,
				(state, action: PayloadAction<Workspace>) => {
					state.isLoading = false;
					state.workspaces.push(action.payload);
				},
			)
			.addCase(addWorkspace.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(getAllWorkspaces.pending, (state) => {
				state.loadingState = "loading";
				state.isLoading = true;
			})
			.addCase(
				getAllWorkspaces.fulfilled,
				(state, action: PayloadAction<Workspace[]>) => {
					state.loadingState = "succeded";
					state.isLoading = false;
					state.workspaces = action.payload;
				},
			)
			.addCase(getAllWorkspaces.rejected, (state, action) => {
				state.loadingState = "failed";
				state.isLoading = false;
				console.error(action);
			})
			.addCase(getTeam.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getTeam.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(getTeam.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(incrementCreatedIssues.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(incrementCreatedIssues.fulfilled, (state) => {
				state.isLoading = false;
				if (state.currentWorkspace.issuesCreated) {
					state.currentWorkspace.issuesCreated += 1;
				}
			})
			.addCase(incrementCreatedIssues.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(getWorkspace.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getWorkspace.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(getWorkspace.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(deleteWorkspace.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteWorkspace.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(deleteWorkspace.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(deleteTeam.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteTeam.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload) {
					const indexOfDeletedWorkspace = state.workspaces
						.map((each) => {
							return each.id;
						})
						.indexOf(action.payload._id);

					state.workspaces.splice(indexOfDeletedWorkspace, 1);
				}
			})
			.addCase(deleteTeam.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(teamExists.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(teamExists.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(teamExists.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(createTeam.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createTeam.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(createTeam.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(workspaceExists.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(workspaceExists.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(workspaceExists.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(searchTasks.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(searchTasks.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(searchTasks.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(joinWorkspace.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(joinWorkspace.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(joinWorkspace.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})

			.addCase(joiningWorkspaceVerification.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(joiningWorkspaceVerification.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(joiningWorkspaceVerification.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})

			.addCase(createWorkspaceLinkToken.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createWorkspaceLinkToken.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(createWorkspaceLinkToken.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})

			.addCase(enableUniversalLink.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(enableUniversalLink.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(enableUniversalLink.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})

			.addCase(setAssignee.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(setAssignee.fulfilled, (state, action) => {
				state.isLoading = false;
				for (const task of state.taskList) {
					if (task.assigneeName && task.assigneeId === action.payload.id) {
						const indexOfTask = state.taskList.indexOf(task);
						// state.taskList[indexOfTask].assignee = {
						// id: action.payload.id,
						// name: action.payload.name,
						// };
					}
				}
			})
			.addCase(setAssignee.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})

			.addCase(getAllUsers.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllUsers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.allUsersInWorkspace = action.payload;
			})
			.addCase(getAllUsers.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(setRepo.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				setRepo.fulfilled,
				(state, action: PayloadAction<GithubRepo>) => {
					state.isLoading = false;
					state.currentWorkspace.githubRepoInfoId = action.payload.repoName;
				},
			)
			.addCase(setRepo.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(getCommitsByRepo.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				getCommitsByRepo.fulfilled,
				(state, action: PayloadAction<Commit[]>) => {
					if (action.payload) {
						state.isLoading = false;
						state.currentCommits = action.payload;
					}
				},
			)
			.addCase(getCommitsByRepo.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			})
			.addCase(deleteTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
				if (action.payload) {
					state.isLoading = false;
					state.currentTeam.tasks = state.currentTeam.tasks.filter((task) => {
						if (task.id === action.payload) {
							return false;
						}
						return true;
					});
				}
			})
			.addCase(deleteTask.rejected, (state, action) => {
				state.isLoading = false;
				console.error(action.payload);
			});

		// searchTasks 13
	},
});

export const {
	setTaskList,
	setTaskPage,
	setStatus,
	setPriority,
	setLabels,
	setDueDate,
	setEffortEstimate,
	getTasksError,
	setWorkspace,
	incrementWorkspaceIssues,
	getWorkspaceSuccess,
	getWorkspaceFailure,
	setCurrentTeam,
	setAccessId,
	getTeamSuccess,
	getTeamFailure,
	clearCommits,
	disconnectGithubRepo,
} = taskData.actions;

export default taskData;
