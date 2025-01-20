import type { NotificationFilter } from "@/app/inbox/page";
import type { Notification, Workspace } from "@squared/db";
import { Button } from "@squaredmade/ui/button";
import { Label } from "@squaredmade/ui/label";
import { Separator } from "@squaredmade/ui/separator";
import {
	BadgePlus,
	Bookmark,
	Check,
	Handshake,
	Inbox,
	type LucideIcon,
	MapPin,
	MessageCircleMore,
} from "lucide-react";

type SidebarProps = {
	setFilterType: (type: NotificationFilter) => void;
	setWorkspace: (workspace: string) => void;
	filterType: NotificationFilter;
	readNotifications: Notification[];
	workspaces: Workspace[];
	workspace: string | null;
};

type FilterButtonProps = {
	type: NotificationFilter;
	icon: LucideIcon;
	label: string;
	unreadCount?: number;
	isSelected: boolean;
	onClick: () => void;
};

type WorkspaceFilterButtonProps = {
	workspace: Workspace;
	unreadCount: number;
	isSelected: boolean;
	onClick: () => void;
};

const FilterButton = ({
	icon: Icon,
	label,
	unreadCount,
	isSelected,
	onClick,
}: FilterButtonProps) => (
	<Button
		variant="ghost"
		className={`w-full justify-between relative ${isSelected && "bg-accent"}`}
		onClick={onClick}
	>
		<div className="flex gap-2 items-center">
			{isSelected && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
			)}
			<Icon className="size-5" />
			{label}
		</div>
		{unreadCount !== undefined && unreadCount > 0 && (
			<div
				className={`rounded-full w-7 ${isSelected ? "bg-primary/20" : "bg-muted"} p-1 text-xxs`}
			>
				{unreadCount}
			</div>
		)}
	</Button>
);

const WorkspaceFilterButton = ({
	workspace,
	unreadCount,
	isSelected,
	onClick,
}: WorkspaceFilterButtonProps) => (
	<Button
		variant="ghost"
		className={`w-full justify-between relative ${isSelected && "bg-accent"}`}
		onClick={onClick}
	>
		<div>
			{isSelected && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
			)}
			{workspace.name}
		</div>
		{unreadCount > 0 && (
			<div
				className={`rounded-full w-7 ${isSelected ? "bg-primary/20" : "bg-muted"} p-1 text-xxs`}
			>
				{unreadCount}
			</div>
		)}
	</Button>
);

export function InboxSidebar({
	setFilterType,
	setWorkspace,
	filterType,
	readNotifications,
	workspaces,
	workspace,
}: SidebarProps) {
	const filters: {
		type: NotificationFilter;
		icon: LucideIcon;
		label: string;
	}[] = [
		{ type: "INBOX", icon: Inbox, label: "Inbox" },
		{ type: "SAVED", icon: Bookmark, label: "Saved" },
		{ type: "DONE", icon: Check, label: "Done" },
		{ type: "ASSIGNED", icon: MapPin, label: "Assigned" },
		{ type: "PARTICIPATING", icon: Handshake, label: "Participating" },
		{ type: "MENTIONED", icon: MessageCircleMore, label: "Mentioned" },
		{ type: "CREATED", icon: BadgePlus, label: "Created" },
	];

	const getUnreadCount = (type: NotificationFilter) => {
		if (type === "INBOX")
			return readNotifications.filter((n) => !n.dismissed).length;
		return readNotifications
			.filter((n) => n.type === type)
			.filter((n) => !n.dismissed).length;
	};

	return (
		<div className="w-72 border-r border-border h-full md:block hidden p-4 bg-card dark:bg-transparent">
			<nav>
				<ul className="space-y-4">
					<div className="space-y-2">
						{filters.slice(0, 3).map((filter) => (
							<li key={filter.type}>
								<FilterButton
									type={filter.type}
									icon={filter.icon}
									label={filter.label}
									unreadCount={
										filter.type === "INBOX"
											? getUnreadCount(filter.type)
											: undefined
									}
									isSelected={filterType === filter.type}
									onClick={() => setFilterType(filter.type)}
								/>
							</li>
						))}
					</div>
					<Separator />
					<div className="space-y-2">
						<Label className="text-muted-foreground ml-4">Filters</Label>
						{filters.slice(3).map((filter) => (
							<li key={filter.type}>
								<FilterButton
									type={filter.type}
									icon={filter.icon}
									label={filter.label}
									unreadCount={getUnreadCount(filter.type)}
									isSelected={filterType === filter.type}
									onClick={() => setFilterType(filter.type)}
								/>
							</li>
						))}
					</div>
					<Separator />
					<div className="space-y-2">
						<Label className="text-muted-foreground ml-4">Workspaces</Label>
						{workspaces.map((w) => (
							<li key={w.id}>
								<WorkspaceFilterButton
									workspace={w}
									unreadCount={
										readNotifications
											.filter((n) => n.workspaceId === w.id)
											.filter((n) => !n.dismissed).length
									}
									isSelected={workspace === w.id && filterType === "WORKSPACE"}
									onClick={() => {
										setWorkspace(w.id);
										setFilterType("WORKSPACE");
									}}
								/>
							</li>
						))}
					</div>
				</ul>
			</nav>
		</div>
	);
}
