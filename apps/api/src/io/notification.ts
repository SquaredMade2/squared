import Task from "../models/task";
import User from "../models/user";
import Notification from "../models/notification";
import { sendMentionedUserMail } from "../helpers/transporter";
import type { UserSocket } from "./notification.interface";
import type { Server } from "socket.io";

async function getUsersNotification(
	userSocketId: UserSocket,
	id: string,
	io: Server,
) {
	try {
		const notification = await Notification.find({ user: id })
			.populate("task")
			.exec();

		if (!notification) {
			return;
		}
		const stringifiedData = JSON.stringify(notification, null, 2);
		io.to(userSocketId[id]).emit("send_notification", stringifiedData);
	} catch (error) {}
}

async function userMentionedOnTask(
	userSocketId: UserSocket,
	io: Server,
	mentionedUsers: string[],
	taskId: string,
	mentionedBy: string,
) {
	try {
		await Promise.all(
			mentionedUsers.map(async (user: string) => {
				const userMentioned = await Notification.findOne({
					user: user,
					task: taskId,
				});
				if (userMentioned) {
					return;
				}
				const getUser = await User.findById(user);
				const getTask = await Task.findById(taskId);
				const mentionedByThisUser = await User.findById(mentionedBy);
				if (!getUser || !getTask || !mentionedByThisUser) {
					return;
				}

				const notification = new Notification({
					user: user,
					task: taskId,
					read: false,
				});

				await notification.save();
				const populateNotificationTask = await Notification.findById(
					notification.id,
				)
					.populate("task")
					.exec();
				const stringifyNotificationData = JSON.stringify(
					populateNotificationTask,
					null,
					2,
				);

				io.to(userSocketId[user]).emit(
					"new_notification",
					stringifyNotificationData,
				);
				sendMentionedUserMail(
					getUser.name,
					getTask.title,
					mentionedByThisUser.name,
					getUser.email,
				);
			}),
		);
	} catch (error) {}
}

async function updateNotificationToRead(
	userSocketId: UserSocket,
	notificationIds: string | string[],
	userId: string,
	io: Server,
) {
	try {
		const idsToUpdate = Array.isArray(notificationIds)
			? notificationIds
			: [notificationIds];
		for (const id of idsToUpdate) {
			await Notification.findByIdAndUpdate(id, { read: true }, { new: true })
				.populate("task")
				.exec();
		}
		const getUpdatedNotification = await Notification.find({ user: userId })
			.populate("task")
			.exec();
		const stringifyData = JSON.stringify(getUpdatedNotification, null, 2);
		io.to(userSocketId[userId]).emit(
			"receiving_updatedMarkedNotification",
			stringifyData,
		);
	} catch (error) {}
}

async function removedNotification(
	userSocketId: UserSocket,
	io: Server,
	taskId: string,
) {
	try {
		const notifications = await Notification.find({ task: taskId }, "user");
		await Notification.deleteMany({ task: taskId });
		const uniqueUsers = new Set(
			notifications.map((notification) => notification.user.toString()),
		);
		for (const userId of uniqueUsers) {
			const updatedNotificationList = await Notification.find({
				user: userId,
			});
			io.to(userSocketId[userId]).emit(
				"notification_removed",
				updatedNotificationList,
			);
		}
	} catch (error) {}
}

module.exports = {
	getUsersNotification,
	userMentionedOnTask,
	removedNotification,
	updateNotificationToRead,
};
