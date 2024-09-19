"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
	BadgePlus,
	Bookmark,
	Check,
	ChevronDown,
	Handshake,
	Inbox,
	MapPin,
	MessageCircleMore,
} from "lucide-react";
import { DialogTitle } from "@repo/ui/dialog";
import { VisuallyHidden } from "@repo/ui/visually-hidden";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type NotificationFilter =
	| "INBOX"
	| "SAVED"
	| "DONE"
	| "ASSIGNED"
	| "PARTICIPATING"
	| "MENTIONED"
	| "CREATED"
	| "WORKSPACE";

type NotificationTask = {
	type: string;
	workspaceId: string;
};

type Workspace = { id: string; name: string };

interface MobileInboxSwitcherProps {
	setFilterType: (type: NotificationFilter) => void;
	setWorkspace: (workspace: string) => void;
	filterType: NotificationFilter;
	readNotifications: NotificationTask[];
	workspaces: Workspace[];
	workspace: string | null;
	filterRead: boolean;
	setFilterRead: (value: boolean) => void;
}

export function MobileInboxSwitcher({
	setFilterType,
	setWorkspace,
	filterType,
	readNotifications,
	workspaces,
	workspace,
	filterRead,
	setFilterRead,
}: MobileInboxSwitcherProps) {
	const [open, setOpen] = useState(false);

	const filters = [
		{ type: "INBOX" as const, label: "Inbox", icon: Inbox },
		{ type: "SAVED" as const, label: "Saved", icon: Bookmark },
		{ type: "DONE" as const, label: "Done", icon: Check },
		{ type: "ASSIGNED" as const, label: "Assigned", icon: MapPin },
		{ type: "PARTICIPATING" as const, label: "Participating", icon: Handshake },
		{ type: "MENTIONED" as const, label: "Mentioned", icon: MessageCircleMore },
		{ type: "CREATED" as const, label: "Created", icon: BadgePlus },
	];

	const handleSelect = (value: string) => {
		const selectedFilter = filters.find((f) => f.type === value);
		if (selectedFilter) {
			setFilterType(selectedFilter.type);
		} else {
			setWorkspace(value);
			setFilterType("WORKSPACE");
		}
		setOpen(false);
	};

	const getUnreadCount = (type: string) => {
		if (type === "INBOX") {
			return readNotifications.length;
		}
		return readNotifications.filter((n) => n.type === type).length;
	};

	const FilterItem = ({
		type,
		label,
		icon: Icon,
		unreadCount,
	}: {
		type: NotificationFilter;
		label: string;
		icon: React.ElementType;
		unreadCount?: number;
	}) => (
		<CommandItem
			value={type}
			onSelect={handleSelect}
			className="flex items-center justify-between relative"
		>
			<div className="flex items-center gap-2">
				{filterType === type && (
					<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
				)}
				<Icon className="h-5 w-5" />
				{label}
			</div>
			{unreadCount !== undefined && unreadCount > 0 && (
				<div
					className={`rounded-full w-7 ${filterType === type ? "bg-primary/20" : "bg-muted"} p-1 text-xs`}
				>
					{unreadCount}
				</div>
			)}
		</CommandItem>
	);

	const WorkspaceItem = ({
		id,
		name,
		unreadCount,
	}: { id: string; name: string; unreadCount: number }) => (
		<CommandItem
			value={id}
			onSelect={handleSelect}
			className="flex items-center justify-between relative"
		>
			<div>
				{workspace === id && filterType === "WORKSPACE" && (
					<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
				)}
				{name}
			</div>
			{unreadCount > 0 && (
				<div
					className={`rounded-full w-7 ${workspace === id && filterType === "WORKSPACE" ? "bg-primary/20" : "bg-muted"} p-1 text-xs`}
				>
					{unreadCount}
				</div>
			)}
		</CommandItem>
	);

	return (
		<div className="w-full container flex gap-2 md:hidden">
			<Button
				variant="secondary"
				className="w-full justify-between"
				onClick={() => setOpen(true)}
			>
				Switch Inbox
				<ChevronDown className="size-4" />
			</Button>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="secondary" className="justify-between">
						{!filterRead ? "All" : "Unread"}
						<ChevronDown className="ml-2 h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<div className="flex flex-col">
						<Button
							variant="ghost"
							className="justify-between"
							onClick={() => setFilterRead(true)}
						>
							All
							{!filterRead && <Check className="h-4 w-4" />}
						</Button>
						<Button
							variant="ghost"
							className="justify-between"
							onClick={() => setFilterRead(false)}
						>
							Unread
							{!filterRead && <Check className="h-4 w-4" />}
						</Button>
					</div>
				</PopoverContent>
			</Popover>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<VisuallyHidden>
					<DialogTitle>Switch Inbox</DialogTitle>
				</VisuallyHidden>
				<div className="flex flex-col">
					<div className="flex-1 p-4 border-b">
						<h2 className="text-lg font-semibold">Switch Inbox</h2>
						<p className="text-sm text-muted-foreground">
							Select a filter or workspace
						</p>
					</div>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							<FilterItem
								type="INBOX"
								label="Inbox"
								icon={Inbox}
								unreadCount={getUnreadCount("INBOX")}
							/>
							<FilterItem type="SAVED" label="Saved" icon={Bookmark} />
							<FilterItem type="DONE" label="Done" icon={Check} />
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Filters">
							<FilterItem
								type="ASSIGNED"
								label="Assigned"
								icon={MapPin}
								unreadCount={getUnreadCount("ASSIGNED")}
							/>
							<FilterItem
								type="PARTICIPATING"
								label="Participating"
								icon={Handshake}
								unreadCount={getUnreadCount("PARTICIPATING")}
							/>
							<FilterItem
								type="MENTIONED"
								label="Mentioned"
								icon={MessageCircleMore}
								unreadCount={getUnreadCount("MENTIONED")}
							/>
							<FilterItem
								type="CREATED"
								label="Created"
								icon={BadgePlus}
								unreadCount={getUnreadCount("CREATED")}
							/>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Workspaces">
							{workspaces.map((w) => (
								<WorkspaceItem
									key={w.id}
									id={w.id}
									name={w.name}
									unreadCount={
										readNotifications.filter((n) => n.workspaceId === w.id)
											.length
									}
								/>
							))}
						</CommandGroup>
					</CommandList>
				</div>
			</CommandDialog>
		</div>
	);
}
