import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import type { Label } from "@squared/db";
import type { ColumnDef } from "@tanstack/react-table";
import { DeleteLabelButton } from "./DeleteLabelButton";
import { EditLabelButton } from "./EditLabelButton";

export const columns: ColumnDef<Label>[] = [
	{
		accessorKey: "color",
		size: 80,
		cell: ({ row }) => {
			const label = row.original;
			return (
				<div className="flex items-center justify-center gap-2">
					<LabelColor label={label} />
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		cell: ({ row }) => {
			const labelName = row.original.name;
			return (
				<div className="ml-2 w-[200px] truncate">
					<div className="ml-2">{labelName}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "description",
		cell: ({ row }) => {
			const labelDescription = row.original.description;
			return <div className="ml-2 w-[300px] truncate">{labelDescription}</div>;
		},
	},
	{
		accessorKey: "edit",
		cell: ({ row }) => {
			const label = row.original;
			return (
				<div className="flex w-[80px] justify-center">
					<EditLabelButton label={label} />
				</div>
			);
		},
	},
	{
		accessorKey: "delete",
		cell: ({ row, column }) => {
			const labelName = row.original.name;
			const { pageId, labels, refetch } = column.columnDef.meta || {};

			return (
				<div className="flex w-[80px] justify-center">
					<DeleteLabelButton
						labelName={labelName}
						pageId={pageId}
						labels={labels}
						refetch={refetch}
					/>
				</div>
			);
		},
	},
];
