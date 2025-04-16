import { client } from "@/lib/client";
import { useModalStore } from "@/store";
import { useOrganization } from "@clerk/nextjs";
import type { PublicUserData } from "@clerk/types";
import type { Team } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import { Input } from "@squaredmade/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@squaredmade/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { CSVLink } from "react-csv";

export type MemberWithRole = PublicUserData & {
	role: string;
};

interface DataTableProps {
	columns: ColumnDef<MemberWithRole, unknown>[];
	data: MemberWithRole[];
	team: Team | null;
}

export function DataTable({ columns, data }: DataTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const { setShowWorkspaceInvite } = useModalStore((state) => state);
	const { memberships, organization } = useOrganization({
		memberships: {
			infinite: true, // Append new data to the existing list
			keepPreviousData: true, // Persist the cached data until the new data has been fetched
		},
	});

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

	const { data: membersCsv } = useQuery({
		queryKey: ["user", "memberships", organization?.id],
		queryFn: async () => {
			if (!organization) return;
			const teams = await client.team.getUserTeams
				.$get({
					workspaceId: organization.id,
				})
				.then((res) => res.json());
			return memberships?.data?.map((m) => ({
				name: m.publicUserData.firstName,
				role: m.role,
				teams: teams.map((team) => team.name).join(", "),
				active: "active",
				createdAt: m.createdAt,
				lastLogin: m.updatedAt,
			}));
		},
	});

	return (
		<div className="flex flex-col items-start gap-4">
			<div>
				<h4 className="font-semibold">Manage Members</h4>
				<p className="text-muted-foreground text-xs">
					On the Free plan all members in a workspace are administrators.
					Upgrade to a paid plan to add the ability to assign or remove
					administrator roles.{" "}
					<span className="cursor-pointer text-primary underline-offset-4 hover:underline">
						Go to Plans →
					</span>
				</p>
			</div>
			<div className="w-full">
				<div className="flex w-full items-center justify-between py-4">
					<Input
						placeholder="Search by name or email"
						value={searchTerm}
						onChange={handleSearch}
						className="max-w-xs"
					/>
					<div className="flex items-center justify-center gap-2">
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
				<div className="flex w-full flex-col items-center justify-end gap-2 py-4 md:flex-row">
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
