"use client";

import { Button } from "@squaredmade/ui/button";
import { Checkbox } from "@squaredmade/ui/checkbox";
import { Input } from "@squaredmade/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squaredmade/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@squaredmade/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	BellOff,
	Check,
	Circle,
	Ellipsis,
	MoveRight,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { NotificationFilter } from "@/app/(site)/inbox/page";
import type { GetNotificationsResponse } from "@/gen/rpc/event";
import { client } from "@/lib/client";
import { useEventStore } from "@/store";
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
		read: false,
		taskTitle: false,
	});
	const [rowSelection, setRowSelection] = useState({});
	const [showUnreadOnly, setShowUnreadOnly] = useState(false);
	const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
	const [selectAllInInbox, setSelectAllInInbox] = useState(false);
	const { notifications, setNotifications } = useEventStore((state) => state);

	const table = useReactTable({
		columns,
		data,
		filterFns: {
			unread: (row) => !(showUnreadOnly && row.original.read),
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		meta: {
			hoveredRowId,
		},
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		state: {
			columnFilters,
			columnVisibility,
			rowSelection,
			sorting,
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
	const queryClient = useQueryClient();

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
		mutationFn: async () => {
			await client.notification.markAsUnread.$post({
				notificationIds: selectedNotificationIds,
			});
		},
		mutationKey: ["notification", "markAsUnread", selectedNotificationIds],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notification"] });
			updateRowSelection();
		},
	});
	const { mutate: handleMarkAsRead } = useMutation({
		mutationFn: async () => {
			await client.notification.markAsRead.$post({
				notificationIds: selectedNotificationIds,
			});
		},
		mutationKey: ["notification", "markAsRead", selectedNotificationIds],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notification"] });
			updateRowSelection();
		},
	});
	const { mutate: handleMarkAsDismissed } = useMutation({
		mutationFn: async () => {
			return await client.notification.dismiss
				.$post({
					notificationIds: selectedNotificationIds,
				})
				.then((res) => res.json());
		},
		mutationKey: ["markAsDismissed", selectedNotificationIds],
		onSuccess: (updatedNotifications) => {
			setNotifications(updatedNotifications);
			queryClient.invalidateQueries({ queryKey: ["notification"] });
			updateRowSelection();
		},
	});
	const { mutate: handleMarkAsRestored } = useMutation({
		mutationFn: async () => {
			return await client.notification.restore
				.$post({
					notificationIds: selectedNotificationIds,
				})
				.then((res) => res.json());
		},
		mutationKey: ["notification", "markAsRestored", selectedNotificationIds],
		onSuccess: (updatedNotifications) => {
			setNotifications(updatedNotifications);
			queryClient.invalidateQueries({ queryKey: ["notification"] });
			updateRowSelection();
		},
	});
	const { mutate: handleDeleteMany } = useMutation({
		mutationFn: async () => {
			return await client.notification.delete
				.$post({
					notificationIds: selectedNotificationIds,
				})
				.then((res) => res.json());
		},
		mutationKey: [
			"notification",
			"deleteNotifications",
			selectedNotificationIds,
		],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notification"] });
			updateRowSelection();
		},
	});
	const { mutate: handleMoveAllToSaved } = useMutation({
		mutationFn: async () => {
			await client.notification.updateUserNotifications.$post({
				notificationIds: selectedNotificationIds,
			});
		},
		mutationKey: ["notification", "saveNotifications", selectedNotificationIds],
		onSuccess: () => {
			updateRowSelection();
		},
	});

	return (
		<div className="w-full md:container">
			<div className="hidden items-center justify-start gap-4 py-4 md:flex">
				<Input
					className="bg-card"
					onChange={(event) =>
						table.getColumn("taskTitle")?.setFilterValue(event.target.value)
					}
					placeholder="Filter notifications..."
					value={
						(table.getColumn("taskTitle")?.getFilterValue() as string) ?? ""
					}
				/>
				<div className="flex w-36 rounded-md border border-border bg-card dark:bg-transparent">
					<Button
						className="w-full rounded-r-none"
						onClick={() => setShowUnreadOnly(false)}
						variant={showUnreadOnly ? "secondary" : "outline"}
					>
						All
					</Button>
					<Button
						className="rounded-l-none"
						onClick={() => setShowUnreadOnly(true)}
						variant={showUnreadOnly ? "outline" : "secondary"}
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
									aria-label="Select all"
									checked={
										table.getIsAllPageRowsSelected() ||
										(table.getIsSomePageRowsSelected() && "indeterminate")
									}
									onCheckedChange={handleSelectAllOnPage}
								/>
							</TableHead>
							<TableHead>
								<div className="flex flex-col md:flex-row md:items-center md:gap-4">
									{table.getFilteredSelectedRowModel().rows.length > 0 && (
										<div className="flex flex-wrap gap-2 py-2">
											{filterType !== "DONE" ? (
												<>
													<Button
														className="gap-2 bg-secondary"
														onClick={() => handleMarkAsDismissed()}
														size="sm"
														variant="outline"
													>
														<Check className="size-4" />
														<span className="hidden sm:inline">Dismiss</span>
													</Button>
													{!isAllSelected && (
														<Button
															className="gap-2 bg-secondary"
															onClick={() => handleMarkAsUnread()}
															size="sm"
															variant="outline"
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
																className="gap-2 bg-secondary"
																onClick={() => handleMoveAllToSaved()}
																size="sm"
																variant="outline"
															>
																<span>Move all to Saved</span>
															</Button>
														)}
													{allRead || allUnread ? (
														<Button
															className="bg-secondary"
															onClick={() =>
																allUnread
																	? handleMarkAsRead()
																	: handleMarkAsUnread()
															}
															size="sm"
															variant="outline"
														>
															{allUnread ? "Mark as Read" : "Mark as Unread"}
														</Button>
													) : (
														<Popover>
															<PopoverTrigger asChild={true}>
																<Button
																	className="bg-secondary"
																	size="sm"
																	variant="outline"
																>
																	<Ellipsis className="size-4" />
																</Button>
															</PopoverTrigger>
															<PopoverContent className="w-[200px] p-0">
																<div className="flex flex-col">
																	<Button
																		className="justify-start gap-3"
																		onClick={() => handleMarkAsRead()}
																		variant="ghost"
																	>
																		<Circle className="size-4" />
																		Mark as Read
																	</Button>
																	<Button
																		className="justify-start gap-3"
																		onClick={() => handleMarkAsUnread()}
																		variant="ghost"
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
															className="text-xs"
															onClick={handleSelectAllInInbox}
															size="sm"
															variant="link"
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
														className="gap-2 bg-secondary"
														onClick={() => handleMarkAsRestored()}
														size="sm"
														variant="outline"
													>
														<MoveRight className="size-4" />
														<span className="hidden sm:inline">
															Move to inbox
														</span>
													</Button>
													<Button
														className="gap-2 bg-secondary"
														onClick={() => handleDeleteMany()}
														size="sm"
														variant="outline"
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
						{table.getRowModel().rows?.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									className={`
										${row.original.read ? "bg-transparent hover:bg-primary/20" : "bg-card hover:bg-primary/20"}transition-colors`}
									data-state={row.getIsSelected() && "selected"}
									key={row.id}
									onMouseEnter={() => setHoveredRowId(row.id)}
									onMouseLeave={() => setHoveredRowId(null)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell className="p-2 sm:p-4" key={cell.id}>
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
									className="h-24 text-center"
									colSpan={columns.length}
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
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						size="sm"
						variant="outline"
					>
						Previous
					</Button>
					<Button
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						size="sm"
						variant="outline"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
