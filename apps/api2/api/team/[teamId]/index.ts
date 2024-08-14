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
          throw new Error("Tasks not found");
        }

        // Return the found team
        return team;
      } catch (error) {
        console.error("Error finding team:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
