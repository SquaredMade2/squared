import { Task } from "@repo/db/src";
import { prisma } from "@/api";
import { Route } from "@/api/route";

type Params = {
  taskId: string;
};

export function createRoute({}): Route<Params> {
  return {
    GET: async ({ taskId }) => {
      try {
        // Find the task by its ID
        const task: Task | null = await prisma.task.findUnique({
          where: { id: taskId },
        });

        if (!task) {
          throw new Error("Task not found");
        }

        // Return the found task
        return task;
      } catch (error) {
        console.error("Error finding task:", error);
        throw new Error("Internal server error");
      }
    },
    PUT: async ({ taskId }, body) => {
      try {
        const task: Task | null = await prisma.task.update({
          where: { id: taskId },
          data: body,
        });
        if (!task) {
          throw new Error("Task not found");
        }

        // Return the updated task
        return task;
      } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Internal server error");
      }
    },
    POST: async ({ taskId }, body) => {
      try {
        const existingTask = await prisma.task.findUnique({
          where: { id: taskId },
        });

        if (existingTask) {
          throw new Error("Task already exists");
        }

        const newTask = await prisma.task.create({
          data: body,
        });

        if (!newTask) {
          throw new Error("Task not created");
        }

        // Return the new task
        return newTask;
      } catch (error) {
        console.error("Error creating task:", error);
        throw new Error("Internal server error");
      }
    },
    DELETE: async ({ taskId }) => {
      try {
        const task: Task | null = await prisma.task.delete({
          where: { id: taskId },
        });
        if (!task) {
          throw new Error("Task not found");
        }

        // Return success message
        return { message: "Task deleted" };
      } catch (error) {
        console.error("Error deleting task:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
