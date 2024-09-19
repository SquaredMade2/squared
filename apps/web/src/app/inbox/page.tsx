"use client";
import { useEffect, useState } from "react";
import InboxSidebar from "@/components/InboxSidebar";
import { InboxDataTable } from "@/components/InboxDataTable";
import { useAuthStore, useNotificationStore } from "@/store";
import IconLeftMenu from "@/components/IconLeftMenu";
import type { NotificationType } from "@repo/db";

export type NotificationFilter =
	| NotificationType
	| "INBOX"
	| "SAVED"
	| "READ"
	| null;

export default function InboxPage() {
	const { notifications, getAllNotifications } = useNotificationStore(
		(state) => state,
	);
	const { user } = useAuthStore((state) => state);
	const [filterType, setFilterType] = useState<NotificationFilter>(null);
	const [workspace, setWorkspace] = useState<string | null>(null);
	const [filteredNotifications, setFilteredNotifications] =
		useState(notifications);

	useEffect(() => {
		const fetchNotifications = async () => {
			user && (await getAllNotifications(user.id));
		};
		fetchNotifications();
	}, [user]);
	useEffect(() => {
		switch (filterType) {
			case "ASSIGNED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "ASSIGNED"),
				);
				break;
			case "PARTICIPATING":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "PARTICIPATING"),
				);
				break;
			case "MENTIONED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "MENTIONED"),
				);
				break;
			case "CREATED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "CREATED"),
				);
				break;
			case "INBOX":
				setFilteredNotifications(notifications);
				break;
			case "SAVED":
				setFilteredNotifications(
					notifications.filter((n) =>
						user?.savedNotificationIds?.includes(n.id),
					),
				);
				break;
			case "READ":
				setFilteredNotifications(notifications.filter((n) => n.read));
				break;
			default:
				setFilteredNotifications(notifications);
		}
	}, [filterType, notifications]);
	// console.log("notifications", notifications);

	return (
		<div className="flex w-full">
			<div className="hidden md:block">
				<IconLeftMenu />
			</div>
			<InboxSidebar
				setFilterType={setFilterType}
				filterType={filterType}
				setWorkspace={setWorkspace}
			/>
			<div className="flex-1 p-4 container w-full">
				<h1 className="text-2xl font-bold mb-4">Inbox</h1>
				<InboxDataTable data={filteredNotifications} />
			</div>
		</div>
	);
}
