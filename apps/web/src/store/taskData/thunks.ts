import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError, type AxiosResponse } from "axios";
import type {
  AddWorkspaceInterface,
  Assignee,
  GetTeamInterface,
  GetWorkspaceInterface,
  Task,
  Team,
  Workspace,
} from "./taskData.interfaces";
import type { RootState } from "..";
import {
  getTeamFailure,
  getTeamSuccess,
  getWorkspaceFailure,
  getWorkspaceSuccess,
  setAccessId,
  setCurrentTeam,
  setWorkspace,
} from ".";
import { createTaskEventLog } from "../events/actions";

export const createNewTask = createAsyncThunk<
  Task,
  Task,
  { state: RootState }
>(
  "taskData/createNewTask",
  async (task: Task, { getState, rejectWithValue, dispatch }) => {
    const currentTeam = getState().taskData.currentTeam;
    const { _id: authorId, name: authorName } =
      getState().userSettings.user;
    const author = {
      id: authorId,
      name: authorName,
    };
    try {
      const response: AxiosResponse<Task> = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/task/create`,
        data: task,
      });
      const { _id: taskId } = response.data;
      dispatch(createTaskEventLog(taskId, author));
      dispatch(getAllTasks(currentTeam));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteAllTasks = createAsyncThunk(
  "taskData/deleteAllTasks",
  async (tasks: Task[], { rejectWithValue }) => {
    try {
      await axios({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/task/delete-all-tasks`,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "taskData/getAllTasks",
  async (team: Team, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/task/read`,
        params: {
          team: team._id,
          status: status,
        },
        withCredentials: true,
      });
      // dispatch(setCurrentTeam(data)); --- commented out to see if anything breaks, please leave in - Pinak
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const addWorkspace = createAsyncThunk<
  Workspace,
  AddWorkspaceInterface,
  { state: RootState }
>(
  "taskData/addWorkspace",
  async (
    workspace: AddWorkspaceInterface,
    { rejectWithValue, getState, dispatch }
  ) => {
    const identifier = workspace.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 3)
      .toUpperCase();

    const exists = await dispatch(workspaceExists(workspace.url));
    //fix have to do better error handling here -- https://linear.app/project-tasklist/issue/PRO-736/error-handling-bug-addworkspace-and-workspaceexists
    if (exists) {
      try {
        const userData = getState().userSettings.user;
        const { data } = await axios({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/create`,
          data: {
            name: workspace.name,
            url: workspace.url,
            companySize: 10,
            users: userData._id,
            username: userData.name,
          },
        });
        dispatch(
          createTeam({
            name: workspace.name,
            identifier,
            workspaceId: data.workspace._id,
          })
        );
        await dispatch(getAllWorkspaces());

        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return rejectWithValue(error.response?.data);
        }
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue("An unknown error occurred");
      }
    } else {
    }
  }
);

export const getAllWorkspaces = createAsyncThunk<
  Workspace[],
  void,
  { state: RootState }
>(
  "taskData/getAllWorkspaces",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const user = getState().userSettings.user;
    try {
      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/read-all`,
        withCredentials: true,
        params: {
          id: user._id,
        },
      });
      dispatch(setWorkspace(data));
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getTeam = createAsyncThunk<
  Team,
  string,
  { state: RootState }
>(
  "taskData/getTeam",
  async (
    identifier: string | string[],
    { rejectWithValue, getState, dispatch }
  ) => {
    const workspace = getState().taskData.currentWorkspace;
    try {
      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/team/read`,
        withCredentials: true,
        params: {
          identifier: identifier,
          workspace: workspace._id,
        },
      });
      dispatch(setCurrentTeam(data));
      dispatch(getTeamSuccess());
      return data;
    } catch (error) {
      dispatch(getTeamFailure());
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const incrementCreatedIssues = createAsyncThunk(
  "taskData/incrementCreatedIssues",
  async (workspaceId: string, { rejectWithValue, dispatch }) => {
    try {
      await axios({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/update/incrementIssues`,
        withCredentials: true,
        params: {
          id: workspaceId,
        },
      });
      return;
    } catch (error) {
      dispatch(getWorkspaceFailure());
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getWorkspace = createAsyncThunk<
  Workspace,
  GetWorkspaceInterface,
  { state: RootState }
>(
  "taskData/getWorkspace",
  async (
    identification: GetWorkspaceInterface,
    { rejectWithValue, getState, dispatch }
  ) => {
    const url = identification.url;
    const id = identification.id;
    const user = getState().userSettings.user;
    try {
      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/read`,
        withCredentials: true,
        params: {
          url,
          id,
          user: user._id,
        },
      });
      dispatch(getWorkspaceSuccess(data));
      if (!id) {
        dispatch(setCurrentTeam(data.teams[0]));
      }
      dispatch(setAccessId({ status: true, id: user._id }));
      return data.teams[0];
    } catch (error) {
      dispatch(getWorkspaceFailure());
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteWorkspace = createAsyncThunk<
  Workspace,
  string,
  { state: RootState }
>(
  "taskData/deleteWorkspace",
  async (
    workspaceId: string,
    { rejectWithValue, getState, dispatch }
  ) => {
    const teamIds = getState().taskData.currentWorkspace.teams.map(
      (item: Team) => item._id
    );
    const userId = getState().userSettings.user._id;
    try {
      const { data } = await axios({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/delete`,
        withCredentials: true,
        data: {
          id: workspaceId,
          teamIds,
          userId,
        },
      });
      await dispatch(getAllWorkspaces());
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteTeam = createAsyncThunk<
  Team,
  string,
  { state: RootState }
>(
  "taskData/deleteTeam",
  async (teamId: string, { rejectWithValue, getState, dispatch }) => {
    const { url, _id } = getState().taskData.currentWorkspace;
    const identification: GetWorkspaceInterface = {
      url: url,
      id: _id,
    };
    try {
      const { data } = await axios({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/team/delete`,
        withCredentials: true,
        data: {
          id: teamId,
        },
      });
      await dispatch(getWorkspace(identification));
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const teamExists = createAsyncThunk(
  "taskData/teamExists",
  async (
    specifyingData: {
      workspace: string;
      identifier: string;
      name: string;
    },
    { rejectWithValue }
  ) => {
    const workspace = specifyingData.workspace;
    const identifier = specifyingData.identifier;
    const name = specifyingData.name;
    try {
      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/team/exists`,
        withCredentials: true,
        data: {
          workspace: workspace,
          identifier: identifier,
          name: name,
        },
      });
      return false;
    } catch (error) {
      if (error instanceof AxiosError) {
        rejectWithValue(error.response?.data);
      } else if (error instanceof Error) {
        rejectWithValue(error.message);
      }
      rejectWithValue("An unknown error occurred");
      return true;
    }
  }
);

export const createTeam = createAsyncThunk<
  Team,
  GetTeamInterface,
  { state: RootState }
>(
  "taskData/createTeam",
  async (
    teamData: GetTeamInterface,
    { rejectWithValue, getState, dispatch }
  ) => {
    const { url } = getState().taskData.currentWorkspace;
    const workspaceId = teamData.workspaceId;
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/team/create`,
        withCredentials: true,
        data: {
          name: teamData.name,
          identifier: teamData.identifier,
          workspace: teamData.workspaceId,
        },
      });
      await dispatch(getWorkspace({ url, id: workspaceId }));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const workspaceExists = createAsyncThunk(
  "taskData/workspaceExists",
  async (url: string, { rejectWithValue }) => {
    try {
      const exists = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/exists`,
        withCredentials: true,
        params: {
          url,
        },
      });

      //fix have to do better error handling here -- https://linear.app/project-tasklist/issue/PRO-736/error-handling-bug-addworkspace-and-workspaceexists

      return exists;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const searchTasks = createAsyncThunk(
  "taskData/searchTasks",
  async (
    searchInfo: { query: string; workspace: string },
    { rejectWithValue }
  ) => {
    const query = searchInfo.query;
    const workspace = searchInfo.workspace;
    try {
      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/searchQuery`,
        withCredentials: true,
        params: {
          query,
          workspace,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const joinWorkspace = createAsyncThunk(
  "taskData/joinWorkspace",
  async (
    userInfo: { id: string; email: string },
    { rejectWithValue }
  ) => {
    const id = userInfo.id;
    const email = userInfo.email;
    try {
      const { data } = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/join-workspace`,
        withCredentials: true,
        data: {
          id: id,
          email: email,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const joiningWorkspaceVerification = createAsyncThunk(
  "taskData/joiningWorkspaceVerification",
  async (token: string | string[], { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/join/${token}`,
        withCredentials: true,
        params: {
          token: token,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createWorkspaceLinkToken = createAsyncThunk(
  "taskData/createWorkspaceLinkToken",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/create-token-link`,
        data: {
          id: workspaceId,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const enableUniversalLink = createAsyncThunk(
  "taskData/enableUniversalLink",
  async (
    workspaceId: { isEnabled: boolean; workspaceId: string },
    { rejectWithValue }
  ) => {
    const isEnabled = workspaceId.isEnabled;
    const id = workspaceId.workspaceId;
    try {
      const { data } = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/enable-workspace-link`,
        data: {
          workspaceId: id,
          enabled: isEnabled,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const setAssignee = createAsyncThunk(
  "taskData/setAssignee",
  async (
    id: { taskId: string; assignee: Assignee | null },
    { rejectWithValue }
  ) => {
    const taskId = id.taskId;
    const assignee = id.assignee;
    try {
      const { data } = await axios({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/task/update-assignee`,
        data: {
          taskId: taskId,
          assignee: assignee,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "taskData/getAllUsers",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/getAllUsers`,
        params: {
          workspaceId: workspaceId,
        },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createGhWebhook = createAsyncThunk(
  "taskData/createGhWebhook",
  async (
    createGhWebhookParams: {
      ghToken: string;
      ghUser: string;
      ghRepo: string;
      workspaceId: string;
    },
    { rejectWithValue }
  ) => {
    const { ghToken, ghUser, ghRepo, workspaceId } =
      createGhWebhookParams;
    try {
      const { data } = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/webhooks/createGhWebhook`,
        params: {
          ghUser,
          ghRepo,
          ghToken,
          workspaceId,
        },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const setRepo = createAsyncThunk(
  "taskData/setRepo",
  async (
    setRepoInfo: {
      workspaceId: string;
      repoName: string;
      owner: string;
    },
    { rejectWithValue }
  ) => {
    const { workspaceId, repoName, owner } = setRepoInfo;
    try {
      const { data } = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/setGithubRepo`,
        params: {
          workspaceId,
          repoName,
          owner,
        },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getCommitsByRepo = createAsyncThunk(
  "taskData/getCommitsByRepo",
  async (
    repoData: { repoName: string; owner: string },
    { rejectWithValue }
  ) => {
    const { repoName, owner } = repoData;
    try {
      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/commit/getCommitsByRepo`,
        withCredentials: true,
        params: {
          repoName,
          owner,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
