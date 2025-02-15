"use client";

import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import type { GetNotificationsResponse } from "@/gen/rpc/event";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { DialogTitle } from "@squaredmade/ui/dialog";
import { VisuallyHidden } from "@squaredmade/ui/visually-hidden";
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
import { useState } from "react";
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

interface MobileInboxSwitcherProps {
	setFilterType: (type: NotificationFilter) => void;
	filterType: NotificationFilter;
	readNotifications: GetNotificationsResponse;
	filterRead: boolean;
	setFilterRead: (value: boolean) => void;
}

export function MobileInboxSwitcher({
	setFilterType,
	filterType,
	readNotifications,
	filterRead,
	setFilterRead,
}: MobileInboxSwitcherProps) {
	const [open, setOpen] = useState(false);
	const { organization } = useOrganization();
	const { userMemberships, setActive } = useOrganizationList({
		userMemberships: true,
	});

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
		const org =
			userMemberships.data?.find((m) => m.organization.id === value) ??
			userMemberships.data?.[0];
		if (selectedFilter) {
			setFilterType(selectedFilter.type);
		} else if (org) {
			setActive?.({ organization: org.organization });
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
			className="relative flex items-center justify-between"
		>
			<div className="flex items-center gap-2">
				{filterType === type && (
					<div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-md bg-primary" />
				)}
				<Icon className="h-5 w-5" />
				{label}
			</div>
			{unreadCount !== undefined && unreadCount > 0 && (
				<div
					className={`w-7 rounded-full ${filterType === type ? "bg-primary/20" : "bg-muted"} p-1 text-xs`}
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
			className="relative flex items-center justify-between"
		>
			<div>
				{organization?.id === id && filterType === "WORKSPACE" && (
					<div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-md bg-primary" />
				)}
				{name}
			</div>
			{unreadCount > 0 && (
				<div
					className={`w-7 rounded-full ${organization?.id === id && filterType === "WORKSPACE" ? "bg-primary/20" : "bg-muted"} p-1 text-xs`}
				>
					{unreadCount}
				</div>
			)}
		</CommandItem>
	);

	return (
		<div className="flex w-full gap-2 lg:hidden">
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
							onClick={() => setFilterRead(false)}
						>
							All
							{!filterRead && <Check className="h-4 w-4" />}
						</Button>
						<Button
							variant="ghost"
							className="justify-between"
							onClick={() => setFilterRead(true)}
						>
							Unread
							{filterRead && <Check className="h-4 w-4" />}
						</Button>
					</div>
				</PopoverContent>
			</Popover>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<VisuallyHidden>
					<DialogTitle>Switch Inbox</DialogTitle>
				</VisuallyHidden>
				<div className="flex flex-col">
					<div className="flex-1 border-b p-4">
						<h2 className="font-semibold text-lg">Switch Inbox</h2>
						<p className="text-muted-foreground text-sm">
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
							{userMemberships.data?.map(({ organization: w }) => (
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
