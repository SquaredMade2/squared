import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useId } from "react";
import { Button } from "../ui/button";
import type { NotificationTask } from "@/store/notifications";

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
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => <div>{row.original.Task.status}</div>,
	},
	{
		accessorKey: "task",
		header: "Task",
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
		header: "Type",
		cell: ({ row }) => <div>{row.getValue("type")}</div>,
	},
	{
		accessorKey: "avatars",
		header: "Participants",
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
		header: "Created At",
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
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const notification = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(notification.id)}
						>
							Copy notification ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Mark as read</DropdownMenuItem>
						<DropdownMenuItem>Unsubscribe</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
