import { Request, Response } from "express";
import { Task, Team } from "@repo/db/src";
import { prisma } from "../../../..";

type Params = {
  workspaceId: string;
  teamId: string;
};

export function createRoute() {
  return {
    GET: async (req: Request, res: Response) => {
      const { teamId } = req.params;
      try {
        // Find the task by its ID
        const tasks: Task[] | null = await prisma.task.findMany({
          where: { teamId },
        });

        if (!tasks) {
          return res.status(404).json({ message: "Tasks not found" });
        }

        // Return the found task
        res.json(tasks);
      } catch (error) {
        console.error("Error finding tasks:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}
