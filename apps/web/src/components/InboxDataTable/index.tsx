"use client";

import React from "react";
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
import type { NotificationTask } from "@/store/notifications";
import { Checkbox } from "../ui/checkbox";
import { BellOff, Check } from "lucide-react";

export function InboxDataTable({ data }: { data: NotificationTask[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			taskTitle: false,
			read: false,
		});
	const [rowSelection, setRowSelection] = React.useState({});
	const [showUnreadOnly, setShowUnreadOnly] = React.useState(false);

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
	});

	React.useEffect(() => {
		if (showUnreadOnly) {
			table.getColumn("read")?.setFilterValue(showUnreadOnly);
		} else {
			table.getColumn("read")?.setFilterValue(undefined);
		}
	}, [showUnreadOnly, table]);

	const handleMarkAsRead = () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		console.log(
			"Marking as read:",
			selectedRows.map((row) => row.original.id),
		);
	};

	const handleMarkAsUnread = () => {
		const selectedRows = table.getFilteredSelectedRowModel().rows;
		console.log(
			"Marking as unread:",
			selectedRows.map((row) => row.original.id),
		);
	};

	return (
		<div className="w-full">
			<div className="flex items-center justify-start gap-4 py-4">
				<div className="border border-border rounded-md">
					<Button
						variant={showUnreadOnly ? "secondary" : "outline"}
						onClick={() => setShowUnreadOnly(false)}
						className="rounded-r-none"
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
					className="max-w-md"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-popover">
						<TableRow className="hover:bg-popover">
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
								<>
									<div className="text-foreground">Select All</div>
									{table.getFilteredSelectedRowModel().rows.length > 0 && (
										<div className="flex py-2 space-x-2 justify-start">
											<Button
												onClick={handleMarkAsRead}
												variant="outline"
												size="sm"
												className="gap-2 bg-secondary"
											>
												<Check className="size-4" />
												Mark as Read
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
										</div>
									)}
								</>
							</TableHead>
							<TableHead className="w-20" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={row.original.read ? "bg-transparent" : "bg-card"}
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
