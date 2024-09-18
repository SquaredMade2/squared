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
		id: "leftGroup",
		cell: ({ row }) => {
			const taskId = row.original.Task.identifier.split("-")[1];
			const taskName = row.original.Task.title;
			const workspaceName = row.original.Workspace.name;
			const read = row.original.read;

			return (
				<div className="flex items-center gap-4">
					{getStatusIcon(row.original.Task.status)}
					<div
						className={`flex flex-col ${read ? "text-muted-foreground" : ""}`}
					>
						<div className="flex gap-2 text-xxs">
							<div>{workspaceName}</div>
							<div>#{taskId}</div>
						</div>
						<div>{taskName}</div>
					</div>
				</div>
			);
		},
	},
	{
		id: "rightGroup",
		cell: ({ row }) => {
			const type = row.getValue("type") as string;
			const avatars = ["", ""]; // Replace with actual avatar data
			const date: string = row.getValue("createdAt") as string;
			const formattedDate = formatDistanceToNow(new Date(date), {
				addSuffix: true,
			})
				.split(" ")
				.slice(-3)
				.join(" ");

			return (
				<div className="flex items-center justify-end gap-4">
					<div>{type}</div>
					<div className="flex -space-x-2">
						{avatars?.map((avatar, index) => (
							<Avatar key={useId()}>
								<AvatarImage src={avatar} />
								<AvatarFallback>U{index + 1}</AvatarFallback>
							</Avatar>
						))}
					</div>
					<div className="text-muted-foreground text-xs">{formattedDate}</div>
				</div>
			);
		},
	},
];
