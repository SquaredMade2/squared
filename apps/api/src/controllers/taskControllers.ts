import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import Task from "../models/task";
import Team from "../models/team";
import Workspace from "../models/workspace";

const { ObjectId } = mongoose.Types;

const addTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { team } = req.body;
  const task = await Task.create({
    authorId: req.body.authorId,
    title: req.body.title,
    status: req.body.status,
    description: req.body.description,
    identifier: req.body.identifier,
    priority: req.body.priority,
    labels: req.body.labels,
    dueDate: req.body.dueDate,
    effortEstimate: req.body.effortEstimate,
    team: req.body.team,
    dateCreated: req.body.dateCreated,
  });

  await Team.findByIdAndUpdate(
    team,
    { $push: { tasks: task._id } },
    { new: true }
  );

  return res.json(task);
};

const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const teamId = req.query.team;
  const statusQuery = req.query.status;
  if (!teamId) {
    return next(new AppError("$$$ No teamId provided $$$", 404));
  }
  try {
    let statusFilter = {};
    if (statusQuery) {
      if (statusQuery === "active") {
        statusFilter = { status: { $in: ["Todo", "In Progress"] } };
      } else if (statusQuery === "backlog") {
        statusFilter = { status: { $in: ["Backlog"] } };
      } else if (statusQuery === "all") {
        statusFilter = {};
      } else {
        return next(
          new AppError("$$$ Invalid status provided $$$", 404)
        );
      }
    }
    const tasks = await Task.aggregate([
      {
        $match: {
          team:
            typeof teamId === "string"
              ? new ObjectId(teamId)
              : teamId,
          ...statusFilter,
        },
      },
      {
        $addFields: {
          dueDate: {
            $dateToString: {
              format: "%Y-%m-%dT%H:%M:%S.%LZ",
              date: "$dueDate",
            },
          },
          dateCreated: {
            $dateToString: {
              format: "%Y-%m-%dT%H:%M:%S.%LZ",
              date: "$dateCreated",
            },
          },
        },
      },
    ]);
    res.json(tasks);
  } catch (error) {}
};

const getSingleTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const task = await Task.aggregate([
    {
      $match: { _id: new ObjectId(req.params.id) },
    },
    {
      $addFields: {
        dueDate: {
          $dateToString: {
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            date: "$dueDate",
          },
        },
        dateCreated: {
          $dateToString: {
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            date: "$dateCreated",
          },
        },
      },
    },
  ]);
  res.json(task[0]);
};

const getSingleTaskIdentifier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { identifier, url } = req.query;
  const teamIdentifier = (identifier as string)?.split("-")[0];
  const workspace = await Workspace.findOne({ url });
  if (workspace) {
    const team = await Team.findOne({
      identifier: teamIdentifier,
      workspace: workspace._id,
    });
    if (team) {
      const task = await Task.aggregate([
        {
          $match: {
            identifier,
            team: team._id,
          },
        },
        {
          $addFields: {
            dueDate: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: "$dueDate",
              },
            },
            dateCreated: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: "$dateCreated",
              },
            },
          },
        },
      ]);
      res.json(task[0]);
    } else {
      return next(new AppError("$$$ No team found $$$", 404));
    }
  } else {
    return next(new AppError("$$$ No workspace found $$$", 404));
  }
};

const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  await Task.deleteOne({ _id: req.body.id });
  res.sendStatus(200);
};

const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      labels: req.body.labels,
      dueDate: req.body.dueDate,
      effortEstimate: req.body.effortEstimate,
    },
    { new: true }
  );
  const serializedTask = await Task.aggregate([
    {
      $match: {
        _id: new ObjectId(req.params.id),
      },
    },
    {
      $addFields: {
        dueDate: {
          $dateToString: {
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            date: "$dueDate",
          },
        },
        dateCreated: {
          $dateToString: {
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            date: "$dateCreated",
          },
        },
      },
    },
  ]);
  res.json(serializedTask[0]);
};

const updateTaskAfterDrag = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId, status } = req.body;
  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      status: status,
    },
    { new: true }
  );
  const serializedTask = await Task.aggregate([
    {
      $match: {
        _id: new ObjectId(String(taskId)),
      },
    },
    {
      $addFields: {
        dueDate: {
          $dateToString: {
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            date: "$dueDate",
          },
        },
        dateCreated: {
          $dateToString: {
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            date: "$dateCreated",
          },
        },
      },
    },
  ]);
  res.json(serializedTask[0]);
};

const updateTaskAssignee = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId, assignee } = req.body;
  await Task.findByIdAndUpdate(
    taskId,
    {
      assignee: {
        id: assignee.id,
        name: assignee.name,
      },
    },
    { new: true }
  );
  res.send({
    message: `Updated Assignee to ${assignee.name}`,
    name: assignee.name,
    id: assignee.id,
  });
};

export {
  addTask,
  getTask,
  deleteTask,
  updateTask,
  getSingleTask,
  updateTaskAfterDrag,
  updateTaskAssignee,
  getSingleTaskIdentifier,
};
