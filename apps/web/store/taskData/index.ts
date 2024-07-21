import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Access,
  Commits,
  CurrentWorkspace,
  GithubRepo,
  Task,
  TaskDataState,
  Team,
  Workspace,
} from "./taskData.interfaces";
import {
  addWorkspace,
  createNewTask,
  createTeam,
  createWorkspaceLinkToken,
  deleteAllTasks,
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
import { toast } from "react-toastify";

const initialState: TaskDataState = {
  taskList: [],
  taskPage: {
    _id: "",
    title: "",
    status: "Todo",
    identifier: "",
    priority: null,
    labels: [],
    dueDate: null,
    effortEstimate: null,
    description: "",
    team: null as unknown as Team,
    assignee: null,
    dateCreated: new Date(),
    authorId: "",
    taskName: "",
  },
  workspaces: [],
  currentWorkspace: {
    companySize: 0,
    name: "",
    teams: [],
    url: "",
    users: [],
    _id: "",
    universalTokenLink: { token: "", isEnabled: true },
    issuesCreated: 1,
    githubRepoInfo: {
      repoName: "",
      owner: "",
    },
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
  status: "Todo",
  priority: "",
  labels: [],
  dueDate: null,
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
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setPriority(state, action: PayloadAction<string | null>) {
      state.priority = action.payload;
    },
    setLabels(state, action: PayloadAction<string[]>) {
      state.labels = action.payload;
    },
    setDueDate(state, action: PayloadAction<Date | null>) {
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
      state.currentWorkspace.issuesCreated += 1;
    },
    getWorkspaceSuccess(
      state,
      action: PayloadAction<CurrentWorkspace>
    ) {
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
      state.currentWorkspace.githubRepoInfo = {
        repoName: "",
        owner: "",
      };
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
        toast.error("could not get task");
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
        toast(
          "We tried deleting all the tasks, but we were not lucky"
        );
      })
      .addCase(getAllTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllTasks.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.isLoading = false;
          state.taskList = action.payload;
        }
      )
      .addCase(getAllTasks.rejected, (state, action) => {
        state.isLoading = false;
        console.error(action.payload);
        toast("Failed to get all tasks.");
      })
      .addCase(addWorkspace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        addWorkspace.fulfilled,
        (state, action: PayloadAction<Workspace>) => {
          state.isLoading = false;
          state.workspaces.push(action.payload);
        }
      )
      .addCase(addWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        console.error(action.payload);
        toast("Failed create new workspace");
      })
      .addCase(getAllWorkspaces.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllWorkspaces.fulfilled,
        (state, action: PayloadAction<Workspace[]>) => {
          state.status = "succeded";
          state.isLoading = false;
          state.workspaces = action.payload;
        }
      )
      .addCase(getAllWorkspaces.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        console.error(action);
        toast("Failed to get all workspaces.");
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
        toast("Could not find team");
      })
      .addCase(incrementCreatedIssues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(incrementCreatedIssues.fulfilled, (state) => {
        state.isLoading = false;
        state.currentWorkspace.issuesCreated += 1;
      })
      .addCase(incrementCreatedIssues.rejected, (state, action) => {
        state.isLoading = false;
        console.error(action.payload);
        toast("Failed to increment create issues");
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
        toast("failed to get workspace");
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
        toast("failed to delete workspace");
      })
      .addCase(deleteTeam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const indexOfDeletedWorkspace = state.workspaces
            .map((each) => {
              return each._id;
            })
            .indexOf(action.payload._id);

          state.workspaces.splice(indexOfDeletedWorkspace, 1);
        }
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.isLoading = false;
        console.error(action.payload);
        toast("failed to delete Team");
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
      .addCase(
        joiningWorkspaceVerification.rejected,
        (state, action) => {
          state.isLoading = false;
          console.error(action.payload);
        }
      )

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
          if (
            task.assignee &&
            task.assignee.id === action.payload.id
          ) {
            const indexOfTask = state.taskList.indexOf(task);
            state.taskList[indexOfTask].assignee = {
              id: action.payload.id,
              name: action.payload.name,
            };
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
          state.currentWorkspace.githubRepoInfo = action.payload;
          toast.success(
            `Successfuly Set this ${state.currentWorkspace.githubRepoInfo.repoName} to ${state.currentWorkspace.name}`
          );
        }
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
        (state, action: PayloadAction<Commits[]>) => {
          if (action.payload) {
            state.isLoading = false;
            state.currentCommits = action.payload;
          }
        }
      )
      .addCase(getCommitsByRepo.rejected, (state, action) => {
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
