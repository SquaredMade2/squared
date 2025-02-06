import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import type { Label } from "@squared/db";
import type { ColumnDef } from "@tanstack/react-table";
import { DeleteLabelButton } from "./DeleteLabelButton";
import { EditLabelButton } from "./EditLabelButton";

export const columns: ColumnDef<Label>[] = [
	{
		accessorKey: "color",
		cell: ({ row }) => {
			const label = row.original;
			return (
				<div className="flex gap-2">
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
				<div className="flex flex-col items-start">
					<div className="ml-2">{labelName}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "description",
		cell: ({ row }) => {
			const labelDescription = row.original.description;
			return (
				<div className="flex flex-col items-start">
					<div className="ml-2">{labelDescription}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "edit",
		cell: ({ row }) => {
			const label = row.original;
			return <EditLabelButton label={label} />;
		},
	},
	{
		accessorKey: "delete",
		cell: ({ row, column }) => {
			const labelName = row.original.name;
			const { pageId, labels, refetch } = column.columnDef.meta || {};

			return (
				<DeleteLabelButton
					labelName={labelName}
					pageId={pageId}
					labels={labels}
					refetch={refetch}
				/>
			);
		},
	},
];
