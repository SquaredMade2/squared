import type { NotificationFilter } from "@/app/inbox/page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { NotificationTask } from "@/store/notifications";

type SidebarProps = {
	setFilterType: (type: NotificationFilter) => void;
	setWorkspace: (workspace: string) => void;
	filterType: NotificationFilter;
	notifications: NotificationTask[];
};

export default function InboxSidebar({
	setFilterType,
	setWorkspace,
	filterType,
	notifications,
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
				filterType === type ? "bg-accent text-primary" : ""
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

	return (
		<div className="w-64 ml-14 border-r border-border h-full md:block hidden p-4">
			<nav>
				<ul className="space-y-2">
					<li>
						<FilterButton type="INBOX" unreadCount={notifications.length}>
							Inbox
						</FilterButton>
					</li>
					<li>
						<FilterButton type="SAVED">Saved</FilterButton>
					</li>
					<li>
						<FilterButton type="READ">Read</FilterButton>
					</li>
					<Separator />
					<li>
						<FilterButton
							type="ASSIGNED"
							unreadCount={
								notifications.filter((n) => n.type === "ASSIGNED").length
							}
						>
							Assigned
						</FilterButton>
					</li>
					<li>
						<FilterButton
							type="PARTICIPATING"
							unreadCount={
								notifications.filter((n) => n.type === "PARTICIPATING").length
							}
						>
							Participating
						</FilterButton>
					</li>
					<li>
						<FilterButton
							type="MENTIONED"
							unreadCount={
								notifications.filter((n) => n.type === "MENTIONED").length
							}
						>
							Mentioned
						</FilterButton>
					</li>
					<li>
						<FilterButton
							type="CREATED"
							unreadCount={
								notifications.filter((n) => n.type === "CREATED").length
							}
						>
							Created
						</FilterButton>
					</li>
					<Separator />
					<li>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setWorkspace("all")}
						>
							All Workspaces
						</Button>
					</li>
				</ul>
			</nav>
		</div>
	);
}
