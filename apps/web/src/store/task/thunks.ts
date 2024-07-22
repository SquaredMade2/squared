import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSingleTask = createAsyncThunk(
  'task/getSingleTask',
  async (taskId: string, { rejectWithValue }) => {
    //await new Promise((resolve) => setTimeout(resolve, 3000));
    // await new Promise((_, reject) =>
    // 	setTimeout(() => reject(new Error('Simulated error')), 2000)
    // ); // usefull for testing,
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/task/read/${taskId}`);
      const json = await response.json();
      return json;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

interface GetSingleTaskIdentifierArg {
  identifier: string;
  workspace: string;
}

export const getSingleTaskIdentifier = createAsyncThunk(
  'task/getSingleTask',
  async ({ identifier, workspace }: GetSingleTaskIdentifierArg, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_SERVER}/task/readIdentifier`,
        withCredentials: true,
        params: {
          identifier,
          url: workspace,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
