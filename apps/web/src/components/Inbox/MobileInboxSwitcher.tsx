"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import {
	BadgePlus,
	Bookmark,
	Check,
	ChevronDown,
	Handshake,
	Inbox,
	MapPin,
	MessageCircleMore,
} from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { DialogTitle } from "@squaredmade/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squaredmade/ui/popover";
import { useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import type { GetNotificationsResponse } from "@/gen/rpc/event";

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
		{ icon: Inbox, label: "Inbox", type: "INBOX" as const },
		{ icon: Bookmark, label: "Saved", type: "SAVED" as const },
		{ icon: Check, label: "Done", type: "DONE" as const },
		{ icon: MapPin, label: "Assigned", type: "ASSIGNED" as const },
		{ icon: Handshake, label: "Participating", type: "PARTICIPATING" as const },
		{ icon: MessageCircleMore, label: "Mentioned", type: "MENTIONED" as const },
		{ icon: BadgePlus, label: "Created", type: "CREATED" as const },
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

	return (
		<div className="flex w-full gap-2 lg:hidden">
			<Button
				className="w-full justify-between"
				onClick={() => setOpen(true)}
				variant="secondary"
			>
				Switch Inbox
				<ChevronDown className="size-4" />
			</Button>
			<Popover>
				<PopoverTrigger asChild>
					<Button className="justify-between" variant="secondary">
						{filterRead ? "Unread" : "All"}
						<ChevronDown className="ml-2 h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<div className="flex flex-col">
						<Button
							className="justify-between"
							onClick={() => setFilterRead(false)}
							variant="ghost"
						>
							All
							{!filterRead && <Check className="h-4 w-4" />}
						</Button>
						<Button
							className="justify-between"
							onClick={() => setFilterRead(true)}
							variant="ghost"
						>
							Unread
							{filterRead && <Check className="h-4 w-4" />}
						</Button>
					</div>
				</PopoverContent>
			</Popover>
			<CommandDialog onOpenChange={setOpen} open={open}>
				<DialogTitle className="sr-only">Switch Inbox</DialogTitle>
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
								filterType={filterType}
								handleSelect={handleSelect}
								icon={Inbox}
								label="Inbox"
								type="INBOX"
								unreadCount={getUnreadCount("INBOX")}
							/>
							<FilterItem
								filterType={filterType}
								handleSelect={handleSelect}
								icon={Bookmark}
								label="Saved"
								type="SAVED"
							/>
							<FilterItem
								filterType={filterType}
								handleSelect={handleSelect}
								icon={Check}
								label="Done"
								type="DONE"
							/>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Filters">
							<FilterItem
								filterType={filterType}
								handleSelect={handleSelect}
								icon={MapPin}
								label="Assigned"
								type="ASSIGNED"
								unreadCount={getUnreadCount("ASSIGNED")}
							/>
							<FilterItem
								filterType={filterType}
								handleSelect={handleSelect}
								icon={Handshake}
								label="Participating"
								type="PARTICIPATING"
								unreadCount={getUnreadCount("PARTICIPATING")}
							/>
							<FilterItem
								filterType={filterType}
								handleSelect={handleSelect}
								icon={MessageCircleMore}
								label="Mentioned"
								type="MENTIONED"
								unreadCount={getUnreadCount("MENTIONED")}
							/>
							<FilterItem
								filterType={filterType}
								handleSelect={handleSelect}
								icon={BadgePlus}
								label="Created"
								type="CREATED"
								unreadCount={getUnreadCount("CREATED")}
							/>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Workspaces">
							{userMemberships.data?.map(({ organization: w }) => (
								<CommandItem
									className="relative flex items-center justify-between"
									key={w.id}
									onSelect={handleSelect}
									value={w.id}
								>
									<div>
										{organization?.id === w.id &&
											filterType === "WORKSPACE" && (
												<div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-md bg-primary" />
											)}
										{w.name}
									</div>
									{readNotifications.filter((n) => n.workspaceId === w.id)
										.length > 0 && (
										<div
											className={`w-7 rounded-full ${organization?.id === w.id && filterType === "WORKSPACE" ? "bg-primary/20" : "bg-muted"} p-1 text-xs`}
										>
											{
												readNotifications.filter((n) => n.workspaceId === w.id)
													.length
											}
										</div>
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</div>
			</CommandDialog>
		</div>
	);
}

const FilterItem = ({
	type,
	filterType,
	handleSelect,
	label,
	icon: Icon,
	unreadCount,
}: {
	type: NotificationFilter;
	filterType: NotificationFilter;
	handleSelect: (value: string) => void;
	label: string;
	icon: React.ElementType;
	unreadCount?: number;
}) => (
	<CommandItem
		className="relative flex items-center justify-between"
		onSelect={handleSelect}
		value={type}
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
