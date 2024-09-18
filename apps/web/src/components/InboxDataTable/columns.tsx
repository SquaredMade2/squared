import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useId } from "react";
import type { NotificationTask } from "@/store/notifications";
import { getStatusIcon } from "@/utils/enumIcons";

export const columns: ColumnDef<NotificationTask>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "taskTitle",
		accessorFn: (row) => row.Task.title,
		enableHiding: false,
	},
	{
		accessorKey: "status",
		cell: ({ row }) => <div>{getStatusIcon(row.original.Task.status)}</div>,
	},
	{
		accessorKey: "task",
		cell: ({ row }) => {
			const taskId = row.original.Task.identifier.split("-")[1];
			const taskName = row.original.Task.title;
			const workspaceName = row.original.Workspace.name;
			const read = row.original.read;

			return (
				<div className={`flex flex-col ${read && "text-muted-foreground"}`}>
					<div className="flex gap-2 text-xxs">
						<div>{workspaceName}</div>
						<div>#{taskId}</div>
					</div>
					<div>{taskName}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "type",
		cell: ({ row }) => <div>{row.getValue("type")}</div>,
	},
	{
		accessorKey: "avatars",
		cell: ({ row }) => {
			const avatars = ["", ""];
			return (
				<div className="flex -space-x-6 justify-center">
					{avatars?.map((avatar, index) => (
						<Avatar key={useId()}>
							<AvatarImage src={avatar} />
							<AvatarFallback>U{index + 1}</AvatarFallback>
						</Avatar>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		cell: ({ row }) => {
			const date: string = row.getValue("createdAt");
			const formattedDate = formatDistanceToNow(new Date(date), {
				addSuffix: true,
			})
				.split(" ")
				.slice(-3)
				.join(" ");
			return (
				<div className="text-muted-foreground text-xs">{formattedDate}</div>
			);
		},
	},
];
