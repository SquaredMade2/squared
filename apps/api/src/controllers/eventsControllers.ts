import type { Request, Response } from "express";
import {
  CommentModel as Comment,
  TaskEventModel as TaskEvent,
  TaskEventLogModel as TaskEventLog,
} from "../models/events";
import type { TaskEvent as ITaskEvent } from "../interface/events";
import type { Model } from "mongoose";

export const addComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentDate = new Date();

    const comment = await Comment.create({
      comment: req.body.comment,
      author: req.body.author,
      date: currentDate,
      task: req.body.task,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await Comment.find({ task: req.params.taskId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newComment = await Comment.findByIdAndUpdate(
      { _id: req.body._id },
      { comment: req.body.comment },
      { new: true }
    );
    if (newComment) {
      res.json(newComment);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const confirmDeleted = await Comment.deleteOne({
    _id: req.params.id,
  });
  res.json(confirmDeleted);
};

export const createTaskEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const taskEventLog = await TaskEventLog.create({
      author: req.body.author,
      createdAt: new Date(),
      taskId: req.body.taskId,
      eventsLog: [],
    });

    taskEventLog.__v === undefined;

    res.status(200).json(taskEventLog);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const addTaskEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commonFields = {
      type: req.body.type,
      author: req.body.author,
      taskId: req.body.taskId,
      updatedAt: new Date(),
      amendedByUser: req.body.amendedByUser,
    };
    if (req.body.type === "labelsUpdated") {
      const newEvent = await TaskEvent.create({
        ...commonFields,
        originalLabels: req.body.originalLabels || [],
        updatedLabels: req.body.updatedLabels || [],
      });
      res.status(200).json(newEvent);
    } else if (req.body.type === "assigneeUpdated") {
      const newEvent = await TaskEvent.create({
        ...commonFields,
        originalAssignee: req.body.originalAssignee,
        updatedAssignee: req.body.updatedAssignee,
      });

      newEvent.originalLabels = undefined;
      newEvent.updatedLabels = undefined;
      await newEvent.save();
      res.status(200).json(newEvent);
    } else {
      const newEvent = await TaskEvent.create({
        ...commonFields,
        originalValue: req.body.originalValue,
        updatedValue: req.body.updatedValue,
      });

      newEvent.originalLabels = undefined;
      newEvent.updatedLabels = undefined;
      await newEvent.save();
      res.status(200).json(newEvent);
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getTaskEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskEvents = await TaskEvent.find({
      taskId: req.params.taskId,
    });
    res.json(taskEvents);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getTaskEventLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskEventLog = await TaskEventLog.find({
      taskId: req.params.taskId,
    });
    if (taskEventLog.length > 0) {
      res.json(taskEventLog);
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
