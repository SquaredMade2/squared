"use client";
import { useEffect, useState } from "react";
import {
	InboxDataTable,
	InboxSidebar,
	MobileInboxSwitcher,
} from "@/components/Inbox";
import {
	useAuthStore,
	useNotificationStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import IconLeftMenu from "@/components/IconNavbar";
import type { NotificationType } from "@repo/db";
import { MobileMenuSheetTrigger } from "@/components/MobileNav";

export type NotificationFilter =
	| NotificationType
	| "INBOX"
	| "SAVED"
	| "DONE"
	| "WORKSPACE";

export default function InboxPage() {
	const { notifications, getAllNotifications } = useNotificationStore(
		(state) => state,
	);
	const { workspaces } = useWorkspaceStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const [filterType, setFilterType] = useState<NotificationFilter>("INBOX");
	const [workspace, setWorkspace] = useState<string | null>(null);
	const [filteredNotifications, setFilteredNotifications] =
		useState(notifications);
	const [filterRead, setFilterRead] = useState(false);
	const { getUserAvatars } = useUserStore((state) => state);

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
					notifications.filter((n) => n.type === "ASSIGNED" && !n.dismissed),
				);
				setWorkspace(null);
				break;
			case "PARTICIPATING":
				setFilteredNotifications(
					notifications.filter(
						(n) => n.type === "PARTICIPATING" && !n.dismissed,
					),
				);
				setWorkspace(null);
				break;
			case "MENTIONED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "MENTIONED" && !n.dismissed),
				);
				setWorkspace(null);
				break;
			case "CREATED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "CREATED" && !n.dismissed),
				);
				setWorkspace(null);
				break;
			case "INBOX":
				setFilteredNotifications(notifications.filter((n) => !n.dismissed));
				setWorkspace(null);
				break;
			case "SAVED":
				setFilteredNotifications(
					notifications.filter(
						(n) => user?.savedNotificationIds?.includes(n.id) && !n.dismissed,
					),
				);
				setWorkspace(null);
				break;
			case "DONE":
				setFilteredNotifications(notifications.filter((n) => n.dismissed));
				setWorkspace(null);
				break;
			case "WORKSPACE":
				setFilteredNotifications(
					notifications.filter(
						(n) => n.workspaceId === workspace && !n.dismissed,
					),
				);
				break;
			default:
				setFilteredNotifications(notifications);
				setWorkspace(null);
		}
	}, [filterType, notifications, workspace, user]);
	useEffect(() => {
		const fetchAvatars = async () => {
			if (user) {
				await getUserAvatars(user.id);
			}
		};
		fetchAvatars();
	}, [user]);

	return (
		<div className="flex w-full">
			<div className="hidden md:block">
				<IconLeftMenu />
			</div>
			<div className="flex flex-col w-full md:ml-14 ml-0">
				<div className="w-full px-4 md:px-8">
					<div className="flex gap-4 items-center mb-4 py-4 border-b border-border w-full">
						<MobileMenuSheetTrigger />
						<h1 className="text-2xl font-bold">Inbox</h1>
					</div>
					<div className="flex">
						<InboxSidebar
							setFilterType={setFilterType}
							filterType={filterType}
							setWorkspace={setWorkspace}
							readNotifications={notifications.filter(
								(n) => !n.read || !n.dismissed,
							)}
							workspaces={workspaces}
							workspace={workspace}
						/>
						<div className="flex flex-col gap-4 w-full">
							<MobileInboxSwitcher
								setFilterType={setFilterType}
								filterType={filterType}
								setWorkspace={setWorkspace}
								readNotifications={notifications.filter((n) => !n.read)}
								workspaces={workspaces}
								workspace={workspace}
								filterRead={filterRead}
								setFilterRead={setFilterRead}
							/>
							<InboxDataTable
								data={filteredNotifications
									.map((n) => ({
										...n,
										user,
									}))
									.filter((n) => (!filterRead ? true : n.read))}
								filterType={filterType}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
