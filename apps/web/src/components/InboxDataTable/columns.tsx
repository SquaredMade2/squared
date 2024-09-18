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
		id: "content",
		cell: ({ row }) => {
			const taskId = row.original.Task.identifier.split("-")[1];
			const taskName = row.original.Task.title;
			const workspaceName = row.original.Workspace.name;
			const read = row.original.read;
			const type = row.getValue("type") as string;
			const avatars = ["", ""];

			return (
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
					<div className="flex items-center gap-2 mb-2 sm:mb-0">
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
					<div className="flex items-center gap-2">
						<div className="text-sm lowercase">{type}</div>
						<div className="flex -space-x-2">
							{avatars?.map((avatar, index) => (
								<Avatar key={useId()}>
									<AvatarImage src={avatar} />
									<AvatarFallback>U{index + 1}</AvatarFallback>
								</Avatar>
							))}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		id: "timestamp",
		cell: ({ row }) => {
			const date = row.original.createdAt;
			const formattedDate = formatDistanceToNow(date, {
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
