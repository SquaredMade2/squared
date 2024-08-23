import { Team } from "@repo/db";
import { prisma } from "@/api";
import { Route } from "@/api/route";

type Params = {
  workspaceId: string;
};

export function createRoute({}): Route<Params> {
  return {
    GET: async ({ workspaceId }, query) => {
      try {
        // Find teams by team ID
        const teams: Team[] | null = await prisma.team.findMany({
          where: { workspaceId },
        });

        if (!teams) {
          throw new Error("Teams not found");
        }

        // Return the found teams
        return teams;
      } catch (error) {
        console.error("Error finding teams:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
