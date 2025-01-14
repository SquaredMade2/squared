"use client";

import {
	InboxDataTable,
	InboxSidebar,
	MobileInboxSwitcher,
} from "@/components/Inbox";
import { SidebarNav } from "@/components/Sidebar";
import type { GetNotificationsResponse } from "@/gen/rpc/event";
import { eventService, userService } from "@/lib/services";
import {
	useEventStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import type { NotificationType } from "@squared/db";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NotificationFilter =
	| NotificationType
	| "INBOX"
	| "SAVED"
	| "DONE"
	| "WORKSPACE";

export default function InboxPage() {
	const { notifications, setNotifications } = useEventStore((state) => state);
	const { workspaces, workspace } = useWorkspaceStore((state) => state);
	const [filterType, setFilterType] = useState<NotificationFilter>("INBOX");
	const [filteredNotifications, setFilteredNotifications] =
		useState<GetNotificationsResponse>(notifications);
	const [filterRead, setFilterRead] = useState(false);
	const [workspaceName, setWorkspaceName] = useState<string | null>(null);
	const { setUserAvatars, user } = useUserStore((state) => state);
	const { setLastVisitedPage } = useViewStore((state) => state);
	const { user: clerkUser } = useUser();
	const pathname = usePathname();

	useEffect(() => {
		const fetchNotifications = async () => {
			if (clerkUser) {
				const notifications = await eventService.getNotifications(TODO, {
					userId: clerkUser.id,
				});
				setNotifications(notifications);
			}
		};
		fetchNotifications();
	}, [clerkUser, setNotifications]);

	useEffect(() => {
		switch (filterType) {
			case "ASSIGNED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "ASSIGNED" && !n.dismissed),
				);
				break;
			case "PARTICIPATING":
				setFilteredNotifications(
					notifications.filter(
						(n) => n.type === "PARTICIPATING" && !n.dismissed,
					),
				);
				break;
			case "MENTIONED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "MENTIONED" && !n.dismissed),
				);
				break;
			case "CREATED":
				setFilteredNotifications(
					notifications.filter((n) => n.type === "CREATED" && !n.dismissed),
				);
				break;
			case "INBOX":
				setFilteredNotifications(notifications.filter((n) => !n.dismissed));
				break;
			case "SAVED":
				setFilteredNotifications(
					notifications.filter(
						(n) => user?.savedNotificationIds?.includes(n.id) && !n.dismissed,
					),
				);
				break;
			case "DONE":
				setFilteredNotifications(notifications.filter((n) => n.dismissed));
				break;
			case "WORKSPACE":
				setFilteredNotifications(
					notifications.filter(
						(n) => n.workspaceId === workspace?.id && !n.dismissed,
					),
				);
				break;
			default:
				setFilteredNotifications(notifications);
		}
	}, [filterType, notifications, workspace, user]);

	useEffect(() => {
		const fetchAvatars = async () => {
			if (workspace) {
				setUserAvatars(
					await userService.getUserAvatars(TODO, { workspaceId: workspace.id }),
				);
			}
		};
		fetchAvatars();
	}, [user]);

	useEffect(() => {
		if (pathname === "/inbox") {
			setLastVisitedPage("inbox");
		}
	}, [pathname, setLastVisitedPage]);

	return (
		<div className="flex w-full">
			<div className="fixed inset-y-0 z-50 md:relative md:z-0 mt-px">
				<SidebarNav />
			</div>
			<div className="flex flex-col w-full">
				<div className="w-full px-4 md:px-8">
					<div className="flex gap-4 items-center mb-4 py-4 border-b border-border w-full">
						<h1 className="text-2xl font-bold ml-4">Inbox</h1>
					</div>
					<div className="flex">
						<InboxSidebar
							setFilterType={setFilterType}
							filterType={filterType}
							setWorkspace={setWorkspaceName}
							readNotifications={notifications.filter(
								(n) => !n.read || !n.dismissed,
							)}
							workspaces={workspaces}
							workspace={workspaceName}
						/>
						<div className="flex flex-col gap-4 w-full">
							<MobileInboxSwitcher
								setFilterType={setFilterType}
								filterType={filterType}
								setWorkspace={setWorkspaceName}
								readNotifications={notifications.filter((n) => !n.read)}
								workspaces={workspaces}
								workspace={workspaceName}
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
