import { Workspace } from "@repo/db/src";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
  userId: string;
  workspaceId: string;
};

export function createRoute({}): Route<Params> {
  return {
    GET: async ({ userId }) => {
      try {
        // Find workspaces a certain user belongs to

        // change this from discord
        const userWorkspaces: Workspace[] | null = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            Workspaces: true
          }
        });

        if (!userWorkspaces) {
          throw new Error("Teams not found");
        }

        // Return the found workspaces
        return userWorkspaces;
      } catch (error) {
        console.error("Error finding user workspaces:", error);
        throw new Error("Internal server error");
      }
    },
    PUT: async ({ userId, workspaceId }, body) => {
      try {
        const userWorkspace: Workspace | null = await prisma.user.update({
          where: { id: userId },
          select: {
            Workspaces: {
              where: {id: workspaceId}
            }
          },
          data: body,
        });
        if (!userWorkspace) {
          throw new Error("Workspace not found");
        }

        // Return the updated workspace
        return userWorkspace;
      } catch (error) {
        console.error("Error updating workspace:", error);
        throw new Error("Internal server error");
      }
    },
    POST: async ({ userId }, body) => {
      try {
        const existingWorkspace = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (existingWorkspace) {
          throw new Error("Workspace already exists");
        }

        const newWorkspace = await prisma.workspace.create({
          data: {
            id: userId,
            ...body,
          } as Workspace,
        });

        if (!newWorkspace) {
          throw new Error("Task not created");
        }

        // Return the new workspace
        return newWorkspace;
      } catch (error) {
        console.error("Error creating task:", error);
        throw new Error("Internal server error");
      }
    },
    DELETE: async ({ userId }) => {
      try {
        const workspace: Workspace | null = await prisma.workspace.delete({
          where: { id: userId },
        });
        if (!workspace) {
          throw new Error("Workspace not found");
        }

        // Return success message
        return { message: "Workspace deleted" };
      } catch (error) {
        console.error("Error deleting task:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
