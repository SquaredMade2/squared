import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { Octokit } from "octokit";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const GITHUB_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;

export const updateProfile = createAsyncThunk(
  "userSettings/updateProfile",
  async (dispatchedData: {
    name: string;
    username: string;
    id: string;
  }) => {
    const { name, username, id } = dispatchedData;

    const { data } = await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_SERVER}/auth/updateProfile`,
      withCredentials: true,
      params: {
        id,
        username,
        name,
      },
    });
    return data;
  }
);

export const getUser = createAsyncThunk(
  "userSettings/getUser",
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async (_: undefined, { getState }: any) => {
    try {
      const userId = getState().userSettings.user._id;

      const { data } = await axios({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/user`,
        withCredentials: true,
        params: {
          id: userId,
        },
      });

      return data;
    } catch (err) {
      console.error(err);
    }
  }
);

export const getUserById = createAsyncThunk(
  "userSettings/getUserById",
  async (id: string) => {
    const { data } = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER}/auth/user`,
      withCredentials: true,
      params: {
        id: id,
      },
    });
    return data;
  }
);

export const getListOfUsers = async (id: string) => {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER}/auth/user`,
      withCredentials: true,
      params: {
        id: id,
      },
    });
    return data;
  } catch (err) {
    toast.error("Could not get list of users");
  }
};

export const verifyUser = async (token: string) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER}/auth/confirmation/${token}`,
      withCredentials: true,
      params: {
        token: token,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    toast.error("Could not find user to verify");
  }
};

export const getGithubUserData = createAsyncThunk(
  "userSettings/getGithubUserData",
  async (userId: string) => {
    if (userId) {
      try {
        const octokit = new Octokit({
          auth: userId,
        });
        const response = await octokit.request("GET /user", {
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
);

export const setGithubAuthToken = createAsyncThunk(
  "userSettings/setGithubAuthToken",
  async (code: string, { dispatch }) => {
    if (code) {
      try {
        const accessTokenResponse = await axios({
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_SERVER}/auth/getGithubAccessToken`,
          withCredentials: true,
          params: {
            code,
          },
        });
        const accessToken = accessTokenResponse.data.access_token;
        dispatch(getGithubUserData(accessToken));
        return accessToken;
      } catch (error) {
        console.error(error);
      }
    }
  }
);

export const authorizeGithubRedirect: () => void = () => {
  if (CLIENT_ID !== null) {
    const queryString = window.location.pathname;
    const redirectLink = `http://localhost:3000${queryString}`;
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectLink}&scope=admin:repo_hook&scope=user&scope=repo`
    );
  }
};
