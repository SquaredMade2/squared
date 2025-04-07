import { useModalStore } from "@/store";
import type { Label } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import { Input } from "@squaredmade/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@squaredmade/ui/table";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

export function DataTable({
	columns,
	data,
	userRole,
}: {
	columns: ColumnDef<Label, unknown>[];
	data: Label[];
	userRole: string | undefined;
}) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		columns.reduce((init, { id }) => {
			if (id) {
				init[`${id}`] = userRole === "org:admin";
			}
			return init;
		}, {} as VisibilityState),
	);
	const [searchTerm, setSearchTerm] = useState("");
	const { setShowLabelModal, setLabelData } = useModalStore((state) => state);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchTerm(value);
		table.getColumn("name")?.setFilterValue(value);
		table.getColumn("description")?.setFilterValue(value);
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getFilteredRowModel: getFilteredRowModel(),
		state: { columnFilters, columnVisibility },
	});

	return (
		<div className="flex flex-col items-start gap-4">
			<div className="w-full">
				<div className="flex w-full items-center justify-between py-4">
					<Input
						placeholder="Search by name or description"
						value={searchTerm}
						onChange={handleSearch}
						className="max-w-xs"
					/>
					<div className="flex items-center justify-center gap-2">
						<Button
							disabled={userRole !== "org:admin"}
							onClick={() => {
								setShowLabelModal(true);
								setLabelData({});
							}}
						>
							Add New Label
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
