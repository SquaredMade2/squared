"use client";

import React, { useEffect, useState } from "react";
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
import {
	useNotificationStore,
	type NotificationTask,
} from "@/store/notifications";
import { Checkbox } from "../ui/checkbox";
import { BellOff, Check, Circle, Ellipsis, MoveRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { NotificationFilter } from "@/app/inbox/page";

export function InboxDataTable({
	data,
	filterType,
}: { data: NotificationTask[]; filterType: NotificationFilter }) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		taskTitle: false,
		read: false,
	});
	const [rowSelection, setRowSelection] = useState({});
	const [showUnreadOnly, setShowUnreadOnly] = useState(false);
	const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
	const { updateManyNotifications } = useNotificationStore((state) => state);

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

	useEffect(() => {
		if (showUnreadOnly) {
			table.getColumn("read")?.setFilterValue(showUnreadOnly);
		} else {
			table.getColumn("read")?.setFilterValue(undefined);
		}
	}, [showUnreadOnly, table]);

	const handleMarkAsRead = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await updateManyNotifications(
			selectedRows.map((row) => row.original),
			{ read: true },
		);
	};

	const handleMarkAsUnread = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await updateManyNotifications(
			selectedRows.map((row) => row.original),
			{ read: false },
		);
	};

	const handleMarkAsDismissed = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await updateManyNotifications(
			selectedRows.map((row) => row.original),
			{ dismissed: true },
		);
		const updatedRowSelection = { ...table.getState().rowSelection };
		for (const row of selectedRows) {
			delete updatedRowSelection[row.id];
		}
		table.setRowSelection(updatedRowSelection);
	};
	const handleMarkAsRestored = async () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		await updateManyNotifications(
			selectedRows.map((row) => row.original),
			{ dismissed: false },
		);
		const updatedRowSelection = { ...table.getState().rowSelection };
		for (const row of selectedRows) {
			delete updatedRowSelection[row.id];
		}
		table.setRowSelection(updatedRowSelection);
	};

	return (
		<div className="w-full container">
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
									checked={table.getIsAllPageRowsSelected()}
									onCheckedChange={(value) =>
										table.toggleAllPageRowsSelected(!!value)
									}
									aria-label="Select all"
								/>
							</TableHead>
							<TableHead>
								<div className="flex gap-6 items-center">
									<div className="text-foreground w-16">Select All</div>
									{table.getFilteredSelectedRowModel().rows.length > 0 && (
										<div className="flex py-2 space-x-2 justify-start">
											{filterType !== "DONE" ? (
												<>
													<Button
														onClick={handleMarkAsDismissed}
														variant="outline"
														size="sm"
														className="gap-2 bg-secondary"
													>
														<Check className="size-4" />
														Dismiss
													</Button>
													<Button
														onClick={handleMarkAsUnread}
														variant="outline"
														size="sm"
														className="gap-2 bg-secondary"
													>
														<BellOff className="size-4" />
														Unsubscribe
													</Button>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="bg-secondary"
																size={"sm"}
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
												</>
											) : (
												<Button
													onClick={handleMarkAsRestored}
													variant="outline"
													size="sm"
													className="gap-2 bg-secondary"
												>
													<MoveRight className="size-4" />
													Move to inbox
												</Button>
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
				<div className="space-x-2">
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
