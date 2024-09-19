import type { NotificationFilter } from "@/app/inbox/page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { NotificationTask } from "@/store/notifications";
import type { Workspace } from "@repo/db";
import { Label } from "@repo/ui/label";
import {
	BadgePlus,
	Bookmark,
	Check,
	Handshake,
	Inbox,
	MapPin,
	MessageCircleMore,
} from "lucide-react";

type SidebarProps = {
	setFilterType: (type: NotificationFilter) => void;
	setWorkspace: (workspace: string) => void;
	filterType: NotificationFilter;
	readNotifications: NotificationTask[];
	workspaces: Workspace[];
	workspace: string | null;
};

export default function InboxSidebar({
	setFilterType,
	setWorkspace,
	filterType,
	readNotifications,
	workspaces,
	workspace,
}: SidebarProps) {
	const FilterButton = ({
		type,
		children,
		unreadCount,
	}: {
		type: NotificationFilter;
		children: React.ReactNode;
		unreadCount?: number;
	}) => (
		<Button
			variant="ghost"
			className={`w-full justify-between relative ${
				filterType === type ? "bg-accent" : ""
			}`}
			onClick={() => setFilterType(type)}
		>
			<div>
				{filterType === type && (
					<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
				)}
				{children}
			</div>
			{unreadCount && (
				<div
					className={`rounded-full w-7 ${filterType === type ? "bg-primary/20" : "bg-muted"} p-1 text-xxs`}
				>
					{unreadCount}
				</div>
			)}
		</Button>
	);
	const WorkspaceFilterButton = ({
		buttonWorkspace,
		children,
		unreadCount,
	}: {
		buttonWorkspace: string;
		children: React.ReactNode;
		unreadCount?: number;
	}) => (
		<Button
			variant="ghost"
			className={`w-full justify-between relative ${
				buttonWorkspace === workspace ? "bg-accent" : ""
			}`}
			onClick={() => {
				setWorkspace(buttonWorkspace);
				setFilterType("WORKSPACE");
			}}
		>
			<div>
				{buttonWorkspace === workspace && (
					<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
				)}
				{children}
			</div>
			{unreadCount && (
				<div
					className={`rounded-full w-7 ${buttonWorkspace === workspace ? "bg-primary/20" : "bg-muted"} p-1 text-xxs`}
				>
					{unreadCount}
				</div>
			)}
		</Button>
	);

	return (
		<div className="w-72 border-r border-border h-full md:block hidden p-4 bg-card dark:bg-transparent">
			<nav>
				<ul className="space-y-4">
					<div className="space-y-2">
						<li>
							<FilterButton type="INBOX" unreadCount={readNotifications.length}>
								<div className="flex gap-2 items-center">
									<Inbox className="size-5" />
									Inbox
								</div>
							</FilterButton>
						</li>
						<li>
							<FilterButton type="SAVED">
								<div className="flex gap-2 items-center">
									<Bookmark className="size-5" />
									Saved
								</div>
							</FilterButton>
						</li>
						<li>
							<FilterButton type="DONE">
								<div className="flex gap-2 items-center">
									<Check className="size-5" />
									Done
								</div>
							</FilterButton>
						</li>
					</div>
					<Separator />
					<div className="space-y-2">
						<Label className="text-muted-foreground ml-4">Filters</Label>
						<li>
							<FilterButton
								type="ASSIGNED"
								unreadCount={
									readNotifications.filter((n) => n.type === "ASSIGNED").length
								}
							>
								<div className="flex gap-2 items-center">
									<MapPin className="size-5" />
									Assigned
								</div>
							</FilterButton>
						</li>
						<li>
							<FilterButton
								type="PARTICIPATING"
								unreadCount={
									readNotifications.filter((n) => n.type === "PARTICIPATING")
										.length
								}
							>
								<div className="flex gap-2 items-center">
									<Handshake className="size-5" />
									Participating
								</div>
							</FilterButton>
						</li>
						<li>
							<FilterButton
								type="MENTIONED"
								unreadCount={
									readNotifications.filter((n) => n.type === "MENTIONED").length
								}
							>
								<div className="flex gap-2 items-center">
									<MessageCircleMore className="size-5" />
									Mentioned
								</div>
							</FilterButton>
						</li>
						<li>
							<FilterButton
								type="CREATED"
								unreadCount={
									readNotifications.filter((n) => n.type === "CREATED").length
								}
							>
								<div className="flex gap-2 items-center">
									<BadgePlus className="size-5" />
									Created
								</div>
							</FilterButton>
						</li>
					</div>
					<Separator />
					<div className="space-y-2">
						<Label className="text-muted-foreground ml-4">Workspaces</Label>
						{workspaces.map((w) => (
							<li key={w.id}>
								<WorkspaceFilterButton
									buttonWorkspace={w.id}
									unreadCount={
										readNotifications.filter((n) => n.workspaceId === w.id)
											.length
									}
								>
									{w.name}
								</WorkspaceFilterButton>
							</li>
						))}
					</div>
				</ul>
			</nav>
		</div>
	);
}
