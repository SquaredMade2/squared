import { Request, Response } from "express";
import { Task } from "@repo/db/src";
import { prisma } from "../../../..";

type Params = {
  workspaceId: string;
  teamId: string;
};

type Route<T> = {
  GET?: (params: T, query: any) => Promise<any>;
  PUT?: (params: T, query: any, body: any) => Promise<any>;
};

export function createRoute({}): Route<Params> {
  return {
    GET: async ({ teamId }, query) => {
      try {
        // Find tasks by team ID
        const tasks: Task[] | null = await prisma.task.findMany({
          where: { teamId },
        });

        if (!tasks) {
          throw new Error("Tasks not found");
        }

        // Return the found tasks
        return tasks;
      } catch (error) {
        console.error("Error finding tasks:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
