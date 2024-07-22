import { useState, useEffect } from "react";
import type {
  Assignee,
  Author,
  EventType,
  TaskEvent,
  Labels,
} from "@/interfaces/event.interfaces";
import { addTaskEvent } from "@/store/events/actions";
import {
  useAppSelector,
  useAppDispatch,
} from "./typeScriptReduxHooks";

const useLogTaskEvent = () => {
  const [taskEvent, setTaskEvent] = useState<TaskEvent>({
    type: "",
    author: {
      id: "",
      name: "",
    },
    taskId: "",
    updatedAt: null,
    originalLabels: [],
    updatedLabels: [],
    originalValue: "",
    updatedValue: "",
    commentRef: "",
    originalAssignee: {
      id: "",
      name: "not Assigned",
    },
    updatedAssignee: {
      id: "",
      name: "",
    },
  });
  const [valueUpdated, setValueUpdated] = useState(false);
  const [assigneeUpdated, setAssigneeUpdated] = useState(false);
  const [labelsUpdated, setLabelsUpdated] = useState(false);

  const dispatch = useAppDispatch();

  const { _id: userId, name: userName } = useAppSelector(
    (state) => state.userSettings.user
  );

  const author: Author = {
    id: userId,
    name: userName,
  };

  useEffect(() => {
    if (valueUpdated) {
      handleValueUpdated();
    }
    if (assigneeUpdated) {
      handleAssigneeUpdate();
    }
    if (labelsUpdated) {
      handleLabelsUpdated();
    }
  }, [taskEvent]);

  const storeCommonFields = (author: Author, taskId: string) => {
    setTaskEvent({
      ...taskEvent,
      author,
      taskId,
    });
  };

  const storeType = (type: EventType) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      type,
    }));
  };

  const storeCommentRef = (commentRef: string) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      commentRef: commentRef,
    }));
  };

  const storeTaskLabels = (originalLabels: Labels[]) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      originalLabels,
    }));
  };

  const storeTaskValue = (originalValue: string) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      originalValue,
    }));
  };

  const storeTaskAssignee = (assignee: Assignee) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      originalAssignee: assignee,
    }));
  };

  const updateTaskLabels = (updatedLabels: Labels[]) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      updatedLabels,
      updatedAt: new Date(),
    }));
    setLabelsUpdated(true);
  };

  const updateTaskAssignee = (assignee: Assignee) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      updatedAssignee: assignee,
      updatedAt: new Date(),
    }));
    setAssigneeUpdated(true);
  };

  const updateTaskValue = (updatedValue: string) => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      updatedValue,
      updatedAt: new Date(),
    }));
    setValueUpdated(true);
  };

  const resetUpdatedTaskLabels = () => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      updatedLabels: [],
      updatedAt: null,
    }));
    setLabelsUpdated(false);
  };
  const resetUpdatedTaskValue = () => {
    setTaskEvent((taskEvent) => ({
      ...taskEvent,
      updatedValue: "",
      updatedAt: null,
    }));
    setValueUpdated(false);
  };

  const handleLabelsUpdated = () => {
    dispatch(addTaskEvent(taskEvent));
    resetUpdatedTaskLabels();
  };

  const handleValueUpdated = () => {
    dispatch(addTaskEvent(taskEvent));
    taskEvent.updatedValue && storeTaskValue(taskEvent.updatedValue);
    resetUpdatedTaskValue();
  };

  const handleAssigneeUpdate = () => {
    dispatch(addTaskEvent(taskEvent));
    setAssigneeUpdated(false);
  };

  const resetTaskEvent = () => {
    setTaskEvent({
      type: "",
      author: {
        id: "",
        name: "",
      },
      taskId: "",
      updatedAt: null,
      originalLabels: [],
      updatedLabels: [],
      originalValue: "",
      updatedValue: "",
      commentRef: "",
      originalAssignee: {
        id: "",
        name: "",
      },
      updatedAssignee: {
        id: "",
        name: "",
      },
    });
  };

  return {
    author,
    handleLabelsUpdated,
    taskEvent,
    storeCommonFields,
    storeType,
    storeCommentRef,
    storeTaskAssignee,
    storeTaskLabels,
    storeTaskValue,
    updateTaskAssignee,
    updateTaskLabels,
    updateTaskValue,
    resetTaskEvent,
  };
};

export default useLogTaskEvent;
