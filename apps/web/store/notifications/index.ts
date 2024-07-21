import { createSlice } from '@reduxjs/toolkit';

interface Task {
  _id: string;
  title: string;
  description: string;
}

export interface NotificationProps {
  description: string;
  name: string;
  title: string;
  _id: string;
  createdAt: string;
  task: Task[];
  read: boolean;
}
[];

interface NotificationState {
  notifications: NotificationProps[];
}

const initialState: NotificationState = {
  notifications: [],
};
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    getNotifications: (state, action) => {
      state.notifications = action.payload.sort((a: NotificationProps, b: NotificationProps) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },
    newNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },
});

export default notificationSlice.reducer;
export const { getNotifications, newNotification } = notificationSlice.actions;
