import { Request, Response } from "express";
import { Task } from "@repo/db/src";
import { prisma } from "../../";

type Params = {
  taskId: string;
};

export function createRoute() {
  return {
    GET: async (req: Request<Params>, res: Response) => {
      const { taskId } = req.params;

      try {
        // Find the task by its ID
        const task: Task | null = await prisma.task.findUnique({
          where: { id: taskId },
        });

        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }

        // Return the found task
        res.json(task);
      } catch (error) {
        console.error("Error finding task:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
    PUT: async (req: Request<Params>, res: Response, body: Task) => {
      const { taskId } = req.params;
      try {
        const task: Task | null = await prisma.task.update({
          where: { id: taskId },
          data: body,
        });
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }

        // Return the updated task
        res.json(task);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}
