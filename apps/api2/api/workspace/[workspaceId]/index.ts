import { Workspace } from "@repo/db/src";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
  workspaceId: string;
};

export function createRoute({}): Route<Params> {
  return {
    GET: async ({ workspaceId }) => {
      try {
        // Find workspace by workspace ID
        const workspace: Workspace | null = await prisma.workspace.findUnique({
          where: { id: workspaceId },
        });

        if (!workspace) {
          throw new Error("Workspace not found");
        }

        // Return the found workspace
        return workspace;
      } catch (error) {
        console.error("Error finding teams:", error);
        throw new Error("Internal server error");
      }
    },
    PUT: async ({ workspaceId }, body) => {
      try {
        const workspace: Workspace | null = await prisma.workspace.update({
          where: { id: workspaceId },
          data: body,
        });
        if (!workspace) {
          throw new Error("Workspace not found");
        }

        // Return the updated workspace
        return workspace;
      } catch (error) {
        console.error("Error updating workspace:", error);
        throw new Error("Internal server error");
      }
    },
    POST: async ({ workspaceId }, body) => {
      try {
        const existingWorkspace = await prisma.workspace.findUnique({
          where: { id: workspaceId },
        });

        if (existingWorkspace) {
          throw new Error("Workspace already exists");
        }

        const newWorkspace = await prisma.workspace.create({
          data: {
            id: workspaceId,
            ...body,
          } as Workspace,
        });

        if (!newWorkspace) {
          throw new Error("Workspace not created");
        }

        // Return the new workspace
        return newWorkspace;
      } catch (error) {
        console.error("Error creating workspace:", error);
        throw new Error("Internal server error");
      }
    },
    DELETE: async ({ workspaceId }) => {
      try {
        const workspace: Workspace | null = await prisma.workspace.delete({
          where: { id: workspaceId },
        });
        if (!workspace) {
          throw new Error("Workspace not found");
        }

        // Return success message
        return { message: "Workspace deleted" };
      } catch (error) {
        console.error("Error deleting workspace:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
