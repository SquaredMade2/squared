"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/store";
import type { Workspace } from "@squared/db";
import { useState } from "react";
import { CSVLink } from "react-csv";

interface DataTableProps<TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	workspace: Workspace | null;
}
interface TData {
	name: string;
	role: string;
	email: string;
	github: string;
	avatar: string;
	username: string;
}

export function DataTable<TValue>({ columns, data }: DataTableProps<TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const { setShowWorkspaceInvite } = useModalStore((state) => state);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchTerm(value);

		// Set filter for both name and email columns
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

	const handleWorkspaceInvite = () => {
		setShowWorkspaceInvite(true);
	};

	const generateMembersCsv = () => {
		const members = data.map((member) => {
			return {
				name: member.name,
				role: member.role,
				email: member.email,
				github: member.github || "N/A",
				avatar: member.avatar || "N/A",
				username: member.username,
			};
		});
		return members;
	};
	const membersCsv = generateMembersCsv();

	return (
		<div className="flex flex-col items-start gap-4">
			<div>
				<h4 className="font-semibold">Manage Members</h4>
				<p className="text-xs text-muted-foreground">
					On the Free plan all members in a workspace are administrators.
					Upgrade to a paid plan to add the ability to assign or remove
					administrator roles.{" "}
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
						<Button onClick={handleWorkspaceInvite}>Invite People</Button>
						<Button>
							<CSVLink data={membersCsv}>Export Members to CSV</CSVLink>
						</Button>
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
			</div>
		</div>
	);
}
