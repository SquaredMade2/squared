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
import { userService } from "@/lib/services";
import { useModalStore } from "@/store";
import { TODO } from "@squared/context";
import type { User, Workspace } from "@squared/db";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

export type MemberWithRole = User & {
	role: "admin" | "member";
};

interface DataTableProps {
	columns: ColumnDef<MemberWithRole, unknown>[];
	data: MemberWithRole[];
	workspace: Workspace | null;
}

interface CsvType {
	name: string;
	email: string;
	role: "admin" | "member";
	teams: string;
	active: string;
	lastLogin: Date;
}
export function DataTable({ columns, data }: DataTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const { setShowWorkspaceInvite } = useModalStore((state) => state);
	const [membersCsv, setMembersCsv] = useState<CsvType[] | null>(null);

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

	const generateMembersCsv = async () => {
		const members = await Promise.all(
			data.map(async (member: MemberWithRole) => {
				const teams = await userService.getUserTeams(TODO, {
					userId: member.id,
				});
				const teamNames = teams.map((team) => team.name).join(", ");
				return {
					name: member.name,
					email: member.email,
					role: member.role,
					teams: teamNames,
					active: "active",
					lastLogin: member.lastLogin,
					createdAt: member.createdAt,
				};
			}),
		);
		return members;
	};

	useEffect(() => {
		const generateCsv = async () => {
			const csv = await generateMembersCsv();
			setMembersCsv(csv);
		};
		generateCsv();
	}, []);

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
					<Button variant={"outline"}>
						{membersCsv && (
							<CSVLink data={membersCsv}>Export Members to CSV</CSVLink>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
