"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Team, User } from "@squared/db";
import type React from "react";
import { useState } from "react";

interface DataTableProps {
	columns: ColumnDef<User>[];
	data: User[];
	team: Team | null;
}

export function DataTable({ columns, data }: DataTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchTerm(value);

		//Set filter for both name and email columns
		table.getColumn("name")?.setFilterValue(value);
		table.getColumn("email")?.setFilterValue(value);
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
		},
	});

	return (
		<div className="flex flex-col items-start gap-4">
			<div>
				<h4 className="font-semibold">Manage Members</h4>
				<p className="text-xs text-muted-foreground">
					On the Free plan all members in a workspace are administrators.
					Upgrade to a paid plan to add the ability to assign or remove
					administrator roles.
					<span className="text-primary underline-offset-4 hover:underline cursor-pointer">
						Go to Plans →
					</span>
				</p>
			</div>
			<div className="w-full">
				<div className="flex items-center py-4 w-full justify-between">
					<Input
						placeholder="Search by name or email"
						value={searchTerm}
						onChange={handleSearch}
						className="max-w-xs"
					/>
					<div className="flex justify-center items-center gap-2">
						{/* <Button onClick={handleWorkspaceInvite}>Invite People</Button> */}
					</div>
				</div>
				<Table>
					<TableBody className="divide-y divide-border">
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
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
				<div className="flex flex-col justify-end items-center py-4 w-full gap-2 md:flex-row">
					<p className="text-muted-foreground">
						Download your member data in a CSV format for use elsewhere. This
						includes names, emails, roles, and much more!
					</p>
				</div>
			</div>
		</div>
	);
}
