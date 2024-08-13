import { Task } from "@repo/db/src";
import { prisma } from "@/api";
import { Route } from "@/api/route";

type Params = {
  workspaceId: string;
  teamId: string;
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
