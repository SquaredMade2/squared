import axios from "axios";
import { getSingleTask } from "@/store/task/thunks";

export const editTaskCard = async (updateTaskId) => {
  try {
    await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_SERVER}/task/update`,
      withCredentials: true,
      data: {
        task: updateTaskId,
      },
    });
  } catch (error) {
    console.error("Error editing tasks:", error);
  }
};

export const deleteTaskCard = async (deleteTaskId) => {
  try {
    await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_SERVER}/task/delete`,
      withCredentials: true,
      data: {
        id: deleteTaskId,
      },
    });
  } catch (error) {
    console.error("Error deleting tasks:", error);
  }
};

export const updateTitle = (title, taskId) => async (dispatch) => {
  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`,
      {
        title: title,
      }
    );
    dispatch(getSingleTask(taskId));
  } catch (err) {
    console.error(err);
  }
};

/* eslint-disable */
export const updateMultipleTasks = async (tasks) => {
  try {
    const data = await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_SERVER}/task/updateMultiple`,
      withCredentials: true,
      data: tasks,
    });
    return data;
  } catch (error) {
    console.error("Error creating tasks:", error);
  }
};

export const updateTaskAfterDrag = async (task, droppableId) => {
  try {
    const data = await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_SERVER}/task/update-drag/`,
      withCredentials: true,
      data: {
        taskId: task._id,
        status: droppableId,
      },
    });
    return data;
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
