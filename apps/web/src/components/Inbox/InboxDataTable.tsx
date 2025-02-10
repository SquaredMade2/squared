"use client";

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
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import type { NotificationFilter } from "@/app/inbox/page";
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
import type { GetNotificationsResponse } from "@/gen/rpc/event";
import { client } from "@/lib/client";
import { useEventStore } from "@/store";
import {
	BellOff,
	Check,
	Circle,
	Ellipsis,
	MoveRight,
	Trash2,
} from "@squared/icons";
import { useMutation } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox";
import { columns } from "./columns";

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
	const { notifications, setNotifications } = useEventStore((state) => state);
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

	const updateRowSelection = () => {
		const updatedRowSelection = Object.fromEntries(
			Object.entries(table.getState().rowSelection).filter(
				([id]) => !selectedRows.some((row) => row.id === id),
			),
		);
		table.setRowSelection(updatedRowSelection);
	};

	const isAllSelected = table.getIsAllPageRowsSelected() && selectAllInInbox;
	const { mutate: handleMarkAsUnread } = useMutation({
		mutationKey: ["markAsUnread", selectedNotificationIds],
		mutationFn: async () => {
			await client.notification.markAsUnread.$post({
				notificationIds: selectedNotificationIds,
			});
		},
		onSuccess: () => {
			updateRowSelection();
		},
	});
	const { mutate: handleMarkAsRead } = useMutation({
		mutationKey: ["markAsRead", selectedNotificationIds],
		mutationFn: async () => {
			await client.notification.markAsRead.$post({
				notificationIds: selectedNotificationIds,
			});
		},
		onSuccess: () => {
			updateRowSelection();
		},
	});
	const { mutate: handleMarkAsDismissed } = useMutation({
		mutationKey: ["markAsDismissed", selectedNotificationIds],
		mutationFn: async () => {
			return await client.notification.dismiss
				.$post({
					notificationIds: selectedNotificationIds,
				})
				.then((res) => res.json());
		},
		onSuccess: (updatedNotifications) => {
			setNotifications(updatedNotifications);
			updateRowSelection();
		},
	});
	const { mutate: handleMarkAsRestored } = useMutation({
		mutationKey: ["markAsRestored", selectedNotificationIds],
		mutationFn: async () => {
			return await client.notification.restore
				.$post({
					notificationIds: selectedNotificationIds,
				})
				.then((res) => res.json());
		},
		onSuccess: (updatedNotifications) => {
			setNotifications(updatedNotifications);
			updateRowSelection();
		},
	});
	const { mutate: handleDeleteMany } = useMutation({
		mutationKey: ["handleDeleteNotifications", selectedNotificationIds],
		mutationFn: async () => {
			return await client.notification.delete
				.$post({
					notificationIds: selectedNotificationIds,
				})
				.then((res) => res.json());
		},
		onSuccess: () => {
			updateRowSelection();
		},
	});
	const { mutate: handleMoveAllToSaved } = useMutation({
		mutationKey: ["handleSaveNotifications", selectedNotificationIds],
		mutationFn: async () => {
			await client.notification.updateUserNotifications.$post({
				notificationIds: selectedNotificationIds,
			});
		},
		onSuccess: () => {
			updateRowSelection();
		},
	});

	return (
		<div className="w-full md:container">
			<div className="hidden items-center justify-start gap-4 py-4 md:flex">
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
				<div className="flex w-36 rounded-md border border-border bg-card dark:bg-transparent">
					<Button
						variant={showUnreadOnly ? "secondary" : "outline"}
						onClick={() => setShowUnreadOnly(false)}
						className="w-full rounded-r-none"
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
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-popover">
						<TableRow className="h-14 hover:bg-popover">
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
														onClick={() => handleMarkAsDismissed()}
														variant="outline"
														size="sm"
														className="gap-2 bg-secondary"
													>
														<Check className="size-4" />
														<span className="hidden sm:inline">Dismiss</span>
													</Button>
													{!isAllSelected && (
														<Button
															onClick={() => handleMarkAsUnread()}
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
																onClick={() => handleMoveAllToSaved()}
															>
																<span>Move all to Saved</span>
															</Button>
														)}
													{allRead || allUnread ? (
														<Button
															onClick={() =>
																allUnread
																	? handleMarkAsRead()
																	: handleMarkAsUnread()
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
																		onClick={() => handleMarkAsRead()}
																		className="justify-start gap-3"
																	>
																		<Circle className="size-4" />
																		Mark as Read
																	</Button>
																	<Button
																		variant="ghost"
																		onClick={() => handleMarkAsUnread()}
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
														onClick={() => handleMarkAsRestored()}
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
														onClick={() => handleDeleteMany()}
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
										${row.original.read ? "bg-transparent hover:bg-primary/20" : "bg-card hover:bg-primary/20"}transition-colors`}
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
				<div className="flex-1 text-muted-foreground text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-2">
					<span className="text-muted-foreground text-sm">
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
