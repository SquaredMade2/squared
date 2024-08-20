import { Team } from "@repo/db/src";
import { prisma } from "@/api";
import { Route } from "@/api/route";

type Params = {
  teamId: string;
};

export function createRoute({}): Route<Params> {
  return {
    GET: async ({ teamId }, query) => {
      try {
        // Find team by ID
        const team: Team | null = await prisma.team.findFirst({
          where: { id: teamId },
        });

        if (!team) {
          throw new Error("Team not found");
        }

        // Return the found team
        return team;
      } catch (error) {
        console.error("Error finding team:", error);
        throw new Error("Internal server error");
      }
    },
    POST: async ({ teamId }, body) => {
      try {
        const existingTeam = await prisma.team.findFirst({
          where: { id: teamId },
        });

        if (existingTeam) {
          throw new Error("Team already exists");
        }

        const newTeam = await prisma.team.create({
          data: {
            id: teamId,
            ...body,
          } as Team,
        });

        // Return the new task
        return newTeam;
      } catch (error) {
        console.error("Error creating team:", error);
        throw new Error("Internal server error");
      }
    },
    PUT: async ({ teamId }, body) => {
      try {
        const team: Team | null = await prisma.team.update({
          where: { id: teamId },
          data: body,
        });

        if (!team) {
          throw new Error("Team not found");
        }

        // Return the updated team
        return team;
      } catch (error) {
        console.error("Error updating team:", error);
        throw new Error("Internal server error");
      }
    },
    DELETE: async ({ teamId }) => {
      try {
        const team: Team | null = await prisma.team.delete({
          where: { id: teamId },
        });

        if (!team) {
          throw new Error("Team not found");
        }

        // Return success message
        return { message: "Task deleted" };
      } catch (error) {
        console.error("Error deleting team:", error);
        throw new Error("Internal server error");
      }
    }
  };
}
