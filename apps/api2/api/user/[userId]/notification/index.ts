import { Notification, User } from "@repo/db";
import { prisma } from "@/api";
import { Route } from "@/api/route";

type Params = {
  userId: string;
};

export function createRoute({}): Route<Params> {
  return {
    GET: async ({ userId }) => {
      try {
        // Find the task by its ID
        const user: User | null = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Find notifications assigned to user
        const notifications: Notification[] = await prisma.notification.findMany({
          where: { userId },
        });

        // Return the found notifications
        return notifications;
      } catch (error) {
        console.error("Error finding notifications:", error);
        throw new Error("Internal server error");
      }
    },
    DELETE: async ({ userId }) => {
      try {
        await prisma.notification.deleteMany({
          where: { userId },
        });

        // Return success message
        return { message: "Notification cleared" };
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
