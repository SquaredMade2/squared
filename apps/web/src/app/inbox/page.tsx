"use client";

import {
	InboxDataTable,
	InboxSidebar,
	MobileInboxSwitcher,
} from "@/components/Inbox";
import { SidebarNav } from "@/components/Sidebar";
import type { GetNotificationsResponse } from "@/gen/rpc/event";
import { client } from "@/lib/client";
import {
	useEventStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { NotificationType } from "@squared/db";
import { useQuery } from "@tanstack/react-query";
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
	const pathname = usePathname();

	useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			if (!workspace) throw new Error("No workspace found");
			const [avatars, notifications] = await Promise.all([
				client.user.getWorkspaceAvatars
					.$get({
						workspaceId: workspace.id,
					})
					.then((res) => res.json()),
				client.notification.getNotifications.$get({}).then((res) => res.json()),
			]);
			setNotifications(notifications);
			setUserAvatars(avatars);
			return notifications;
		},
		enabled: !!workspace,
	});

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
		if (pathname === "/inbox") {
			setLastVisitedPage("inbox");
		}
	}, [pathname, setLastVisitedPage]);

	return (
		<div className="flex w-full">
			<div className="fixed inset-y-0 z-50 mt-px md:relative md:z-0">
				<SidebarNav />
			</div>
			<div className="flex w-full flex-col">
				<div className="w-full px-4 md:px-8">
					<div className="mb-4 flex w-full items-center gap-4 border-border border-b py-4">
						<h1 className="ml-4 font-bold text-2xl">Inbox</h1>
					</div>
					<div className="flex">
						<div className="flex w-full flex-col gap-4">
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
					</div>
				</div>
			</div>
		</div>
	);
}
