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
			const type = row.original.type;
			const avatars = ["", ""];

			return (
				<div className="flex items-start sm:items-center gap-4 w-full">
					<div className="flex items-center h-full mt-2 sm:mt-0">
						{getStatusIcon(row.original.Task.status)}
					</div>
					<div className="flex flex-col sm:flex-row justify-between w-full">
						<div
							className={`flex flex-col ${read ? "text-muted-foreground" : ""}`}
						>
							<div className="flex gap-2 text-xxs">
								<div>{workspaceName}</div>
								<div>#{taskId}</div>
							</div>
							<div>{taskName}</div>
						</div>

						<div className="flex items-center gap-2">
							<div className="text-xs lowercase hidden sm:block">{type}</div>
							<div className="flex -space-x-6">
								{avatars?.map((avatar, index) => (
									<Avatar key={useId()}>
										<AvatarImage src={avatar} />
										<AvatarFallback>U{index + 1}</AvatarFallback>
									</Avatar>
								))}
							</div>
							<div className="text-xs lowercase block sm:hidden">{type}</div>
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
				<div className="flex justify-end text-muted-foreground text-xs text-right whitespace-nowrap h-full">
					{formattedDate}
				</div>
			);
		},
	},
];
