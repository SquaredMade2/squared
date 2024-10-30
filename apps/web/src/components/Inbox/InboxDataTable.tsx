"use client";

import { useEffect, useState } from "react";
import {
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { Checkbox } from "../ui/checkbox";
import { useAuthStore, useEventStore, useUserStore } from "@/store";
import {
	BellOff,
	Check,
	MoveRight,
	Trash2,
	Ellipsis,
	Circle,
} from "lucide-react";
import type { NotificationFilter } from "@/app/inbox/page";
import { eventService } from "@/lib/services";
import { TODO } from "@squared/context";
import type { GetNotificationsResponse } from "@/gen/rpc/event";

export function InboxDataTable({
	data,
	filterType,
}: {
	data: GetNotificationsResponse;
	filterType: NotificationFilter;
}) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		taskTitle: false,
		read: false,
	});
	const [rowSelection, setRowSelection] = useState({});
	const [showUnreadOnly, setShowUnreadOnly] = useState(false);
	const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
	const [selectAllInInbox, setSelectAllInInbox] = useState(false);
	const { updateUser, getUser } = useUserStore((state) => state);
	const { user, setUser } = useAuthStore((state) => state);
	const { notifications } = useEventStore((state) => state);
	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		filterFns: {
			unread: (row) => !showUnreadOnly || !row.original.read,
		},
		meta: {
			hoveredRowId,
		},
	});

	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const selectedNotificationIds = selectedRows.map((row) => row.original.id);
	const mySelectedNotification = notifications.filter((msg) =>
		selectedNotificationIds.includes(msg.id),
	);

	const allRead = mySelectedNotification.every(
		(notification) => notification.read === true,
	);
	const allUnread = mySelectedNotification.every(
		(notification) => notification.read === false,
	);

	useEffect(() => {
		if (showUnreadOnly) {
			table.getColumn("read")?.setFilterValue(showUnreadOnly);
		} else {
			table.getColumn("read")?.setFilterValue(undefined);
		}
	}, [showUnreadOnly, table]);

	const handleSelectAllInInbox = () => {
		if (selectAllInInbox) {
			setSelectAllInInbox(false);
			table.toggleAllRowsSelected(false);
		} else {
			setSelectAllInInbox(true);
			table.toggleAllRowsSelected(true);
		}
	};

	const handleSelectAllOnPage = (checked: boolean) => {
		setSelectAllInInbox(false);
		table.toggleAllPageRowsSelected(checked);
		!checked && table.toggleAllRowsSelected(checked);
	};

	const isAllSelected = table.getIsAllPageRowsSelected() && selectAllInInbox;

	const handleMarkAsUnread = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await eventService.toggleNotification(TODO, {
			notificationIds: selectedRows.map((row) => row.original.id),
			read: true,
		});
		const updatedRowSelection = { ...table.getState().rowSelection };
		for (const row of selectedRows) {
			delete updatedRowSelection[row.id];
		}
		table.setRowSelection(updatedRowSelection);
	};

	const handleMarkAsRead = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await eventService.toggleNotification(TODO, {
			notificationIds: selectedRows.map((row) => row.original.id),
			read: false,
		});
		const updatedRowSelection = { ...table.getState().rowSelection };
		for (const row of selectedRows) {
			delete updatedRowSelection[row.id];
		}
		table.setRowSelection(updatedRowSelection);
	};

	const handleMarkAsDismissed = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await eventService.toggleNotification(TODO, {
			notificationIds: selectedRows.map((row) => row.original.id),
			dismissed: true,
		});
		const updatedRowSelection = { ...table.getState().rowSelection };
		for (const row of selectedRows) {
			delete updatedRowSelection[row.id];
		}
		table.setRowSelection(updatedRowSelection);
	};

	const handleMarkAsRestored = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await eventService.toggleNotification(TODO, {
			notificationIds: selectedRows.map((row) => row.original.id),
			dismissed: false,
		});
		const updatedRowSelection = { ...table.getState().rowSelection };
		for (const row of selectedRows) {
			delete updatedRowSelection[row.id];
		}
		table.setRowSelection(updatedRowSelection);
	};

	const handleDeleteMany = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await eventService.deleteNotification(TODO, {
			notificationIds: selectedRows.map((row) => row.original.id),
		});
		const updatedRowSelection = { ...table.getState().rowSelection };
		for (const row of selectedRows) {
			delete updatedRowSelection[row.id];
		}
		table.setRowSelection(updatedRowSelection);
	};

	const handleMoveAllToSaved = async () => {
		// WORK WITH FILTER TYPE TO MOV
		const currentUser = user && (await getUser(user.id)).user;
		if (!currentUser) {
			return;
		}
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		const selectedNotificationIds = selectedRows.map((row) => row.original.id);
		const newSavedNotificationIds = [
			...new Set([
				...currentUser.savedNotificationIds,
				...selectedNotificationIds,
			]),
		];
		const response = await updateUser(user.id, {
			savedNotificationIds: newSavedNotificationIds,
		});
		if (response) {
			setUser(response.user);
		}
	};

	return (
		<div className="w-full md:container">
			<div className="items-center justify-start gap-4 py-4 hidden md:flex">
				<div className="border border-border rounded-md bg-card dark:bg-transparent w-36 flex">
					<Button
						variant={showUnreadOnly ? "secondary" : "outline"}
						onClick={() => setShowUnreadOnly(false)}
						className="rounded-r-none w-full"
					>
						All
					</Button>
					<Button
						variant={showUnreadOnly ? "outline" : "secondary"}
						onClick={() => setShowUnreadOnly(true)}
						className="rounded-l-none"
					>
						Unread
					</Button>
				</div>
				<Input
					placeholder="Filter notifications..."
					value={
						(table.getColumn("taskTitle")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("taskTitle")?.setFilterValue(event.target.value)
					}
					className="bg-card"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-popover">
						<TableRow className="hover:bg-popover h-14">
							<TableHead className="w-12">
								<Checkbox
									checked={
										table.getIsAllPageRowsSelected() ||
										(table.getIsSomePageRowsSelected() && "indeterminate")
									}
									onCheckedChange={handleSelectAllOnPage}
									aria-label="Select all"
								/>
							</TableHead>
							<TableHead>
								<div className="flex flex-col md:flex-row md:items-center md:gap-4">
									{table.getFilteredSelectedRowModel().rows.length > 0 && (
										<div className="flex flex-wrap gap-2 py-2">
											{filterType !== "DONE" ? (
												<>
													<Button
														onClick={handleMarkAsDismissed}
														variant="outline"
														size="sm"
														className="gap-2 bg-secondary"
													>
														<Check className="size-4" />
														<span className="hidden sm:inline">Dismiss</span>
													</Button>
													{!isAllSelected && (
														<Button
															onClick={handleMarkAsUnread}
															variant="outline"
															size="sm"
															className="gap-2 bg-secondary"
														>
															<BellOff className="size-4" />
															<span className="hidden sm:inline">
																Unsubscribe
															</span>
														</Button>
													)}
													{table.getFilteredSelectedRowModel().rows.length >
														1 &&
														filterType === "INBOX" && (
															<Button
																variant="outline"
																className="gap-2 bg-secondary"
																size="sm"
																onClick={handleMoveAllToSaved}
															>
																<span>Move all to Saved</span>
															</Button>
														)}
													{allRead || allUnread ? (
														<Button
															onClick={
																allUnread
																	? handleMarkAsRead
																	: handleMarkAsUnread
															}
															className="bg-secondary"
															size="sm"
															variant="outline"
														>
															{allUnread ? "Mark as Read" : "Mark as Unread"}
														</Button>
													) : (
														<Popover>
															<PopoverTrigger asChild>
																<Button
																	variant="outline"
																	className="bg-secondary"
																	size="sm"
																>
																	<Ellipsis className="size-4" />
																</Button>
															</PopoverTrigger>
															<PopoverContent className="w-[200px] p-0">
																<div className="flex flex-col">
																	<Button
																		variant="ghost"
																		onClick={handleMarkAsRead}
																		className="justify-start gap-3"
																	>
																		<Circle className="size-4" />
																		Mark as Read
																	</Button>
																	<Button
																		variant="ghost"
																		onClick={handleMarkAsUnread}
																		className="justify-start gap-3"
																	>
																		<Circle className="size-4 fill-foreground" />
																		Mark as Unread
																	</Button>
																</div>
															</PopoverContent>
														</Popover>
													)}
													{(table.getIsAllPageRowsSelected() ||
														table.getIsSomePageRowsSelected()) && (
														<Button
															variant="link"
															size="sm"
															onClick={handleSelectAllInInbox}
															className="text-xs"
														>
															{isAllSelected
																? "Clear selection"
																: `Select all ${data.length} items in inbox`}
														</Button>
													)}
												</>
											) : (
												<>
													<Button
														onClick={handleMarkAsRestored}
														variant="outline"
														size="sm"
														className="gap-2 bg-secondary"
													>
														<MoveRight className="size-4" />
														<span className="hidden sm:inline">
															Move to inbox
														</span>
													</Button>
													<Button
														onClick={handleDeleteMany}
														variant="outline"
														size="sm"
														className="gap-2 bg-secondary"
													>
														<Trash2 className="size-4" />
														<span className="hidden sm:inline">
															Clear notifications
														</span>
													</Button>
												</>
											)}
										</div>
									)}
								</div>
							</TableHead>
							<TableHead className="w-40" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={`
										${!row.original.read ? "bg-transparent hover:bg-primary/20" : "bg-card hover:bg-primary/20"}
										transition-colors
									`}
									onMouseEnter={() => setHoveredRowId(row.id)}
									onMouseLeave={() => setHoveredRowId(null)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-2 sm:p-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-2">
					<span className="text-sm text-muted-foreground">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount() || 1}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
