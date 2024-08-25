import { Notification } from "@repo/db";
import { prisma } from "@/api";
import { Route } from "@/api/route";

type Params = {
  notificationId: string;
};

export function createRoute({}): Route<Params> {
  return {
    POST: async ({ notificationId }, body) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: body.userId },
        });

        if (!existingUser) {
          throw new Error("Cannot find User");
        }

        const newNotification = await prisma.notification.create({
          data: {
            id: notificationId,
            ...body,
          } as Notification,
        });

        if (!newNotification) {
          throw new Error("Notification not created");
        }

        // Return the new notification
        return newNotification;
      } catch (error) {
        console.error("Error creating notification:", error);
        throw new Error("Internal server error");
      }
    },
    DELETE: async ({ notificationId }) => {
      try {
        const notification: Notification | null = await prisma.notification.delete({
          where: { id: notificationId },
        });
        if (!notification) {
          throw new Error("Notification not found");
        }

        // Return success message
        return { message: "Notification deleted" };
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw new Error("Internal server error");
      }
    },
  };
}
