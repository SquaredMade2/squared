import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Team from "../models/team";
import Workspace from "../models/workspace";
import Task from "../models/task";
import WorkspaceModel from "../models/workspace";
import AppError from "../utils/AppError";
import {
  getLookup,
  tasksOfTeamFieldsDirect,
} from "../utils/aggregationUtils";

const addTeam = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, identifier, workspace, tasks } = req.body;
  const team = await Team.create({
    name,
    identifier,
    workspace,
    tasks,
  });
  await WorkspaceModel.findByIdAndUpdate(workspace, {
    $push: { teams: team._id },
  });
  return res.json(team);
};

const getTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentTeam = req.query.team;
  const { identifier, workspace } = req.query;
  if (currentTeam) {
    const team = await Team.aggregate([
      {
        $match: {
          _id: currentTeam,
        },
      },
      tasksOfTeamFieldsDirect,
      getLookup("tasks", "tasks", "_id", "tasks"),
    ]);
    if (!team) {
      return next(new AppError("$$$ Team not found $$$", 404));
    }
    res.json(team[0]);
  } else if (identifier) {
    const team = await Team.aggregate([
      {
        $match: {
          identifier: identifier,
          workspace:
            typeof workspace === "string"
              ? new Types.ObjectId(workspace)
              : workspace,
        },
      },
      tasksOfTeamFieldsDirect,
      getLookup("tasks", "tasks", "_id", "tasks"),
    ]);

    if (!team) {
      return next(new AppError("$$$ Team not found $$$", 404));
    }
    res.json(team[0]);
  }
};

const deleteTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  await Task.deleteMany({ team: req.body.id });
  await Workspace.updateMany({}, { $pull: { teams: req.body.id } });
  await Team.deleteOne({ _id: req.body.id });
  res.sendStatus(200);
};

const updateTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, identifier, id, workspaceId } = req.body;

  const errorResponse = {
    statusCode: 409,
    error: "Conflict",
    message: "",
    field: "",
  };

  const currentWorkspace =
    await WorkspaceModel.findById(workspaceId).populate("teams");
  if (!currentWorkspace) {
    errorResponse.message = "Workspace not found";
    errorResponse.field = "Workspace";
    res.status(409).json(errorResponse);
    return;
  }

  // Check if the team identifier already exists in another team.
  const identifierExists = await Team.findOne({
    workspace: workspaceId,
    identifier,
    _id: { $ne: id }, // Ensure the found document is not the team being updated.
  });

  if (identifierExists) {
    errorResponse.message = `a team with identifier "${identifier}" already exists`;
    errorResponse.field = "identifier";
    res.status(409).json(errorResponse);
    return;
  }

  // Check if the team name already exists in another team.
  const nameExists = currentWorkspace?.teams.find(
    (team) =>
      team.name.toLowerCase() === name.toLowerCase() &&
      team._id.toString() !== id
  );

  if (nameExists) {
    errorResponse.message = "A team with that name already exists";
    errorResponse.field = "name";
    res.status(409).json(errorResponse);
  } else {
    await Team.updateOne(
      { _id: id },
      { $set: { name: name, identifier: identifier } }
    );
    res.status(200).json({ message: "Team updated successfully" });
  }
};

const getTeamInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const teams = await Team.find({
    _id: { $in: req.query.teamIdArray },
  });

  res.json(teams);
};

const teamExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, workspace, identifier } = req.body;

  const identifierExists = await Team.findOne({
    workspace,
    identifier,
  });
  const currentWorkspace =
    await WorkspaceModel.findById(workspace).populate("teams");

  let nameExists: boolean;

  if (currentWorkspace) {
    const findName = currentWorkspace.teams.find(
      (value) => value.name.toLowerCase() === name.toLowerCase()
    );
    nameExists = !!findName;
  } else {
    return next(new AppError("No workspace found", 500));
  }

  if (!identifierExists && !nameExists) {
    res.sendStatus(204);
  } else {
    const errorResponse = {
      statusCode: 409,
      error: "Conflict",
      message: "",
      field: "",
    };

    if (identifierExists) {
      errorResponse.message = "Identifier already exists";
      errorResponse.field = "identifier";
    } else {
      errorResponse.message = "Name already exists";
      errorResponse.field = "name";
    }

    res.status(409).json(errorResponse);
  }
};

export {
  addTeam,
  getTeam,
  deleteTeam,
  updateTeam,
  getTeamInfo,
  teamExists,
};
