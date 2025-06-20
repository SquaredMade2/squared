import type { Notification, Task, Workspace } from "@squaredmade/db";
import {
	BellOff,
	Bookmark,
	BookmarkMinus,
	Check,
	Trash2,
} from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import { Checkbox } from "@squaredmade/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { client } from "@/lib/client";
import { useEventStore, useUserStore } from "@/store";
import { formatUrl, getInitials } from "@/utils/formatting";
import { StatusIcon } from "../Icons";

export const columns: ColumnDef<
	Notification & { Task: Task; Workspace: Workspace }
>[] = [
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
		accessorKey: "read",
		accessorFn: (row) => row.read,
		enableHiding: false,
	},
	{
		id: "content",
		cell: ({ row }) => {
			const router = useRouter();
			const { identifier: taskIdentifier, title: taskName } = row.original.Task;
			const { userAvatars } = useUserStore((state) => state);

			const taskId = taskIdentifier.split("-")[1];
			const { name: workspaceName, url: workspaceUrl } = row.original.Workspace;
			const read = !row.original.read;
			const type = row.original.type;
			const avatars = userAvatars.filter(
				({ id }) =>
					id === row.original.Task.assigneeId ||
					id === row.original.Task.authorId,
			);

			const { mutate: handleMarkAsUnread } = useMutation({
				mutationKey: ["notification", "markAsUnread", row.original.id],
				mutationFn: async () => {
					await client.notification.markAsUnread.$post({
						notificationIds: [row.original.id],
					});
				},
				onSuccess: async () => {
					router.push(
						`/${workspaceUrl}/task/${taskIdentifier}/${formatUrl(taskName)}`,
					);
				},
			});

			return (
				<button
					type="button"
					className="flex w-full cursor-pointer items-start gap-4 sm:items-center"
					onClick={() => handleMarkAsUnread()}
				>
					<div className="mt-2 flex h-full items-center sm:mt-0">
						<StatusIcon status={row.original.Task.status} />
					</div>
					<div className="flex w-full flex-col justify-between sm:flex-row">
						<div
							className={`flex flex-col ${!read ? "text-muted-foreground" : ""}`}
						>
							<div className="flex gap-2 text-xxs">
								<div>{workspaceName}</div>
								<div className="text-muted-foreground">#{taskId}</div>
							</div>
							<div>{taskName}</div>
						</div>

						<div className="flex items-center gap-2">
							<div className="hidden text-xs lowercase sm:block">{type}</div>
							<div className="-space-x-6 flex">
								{avatars?.map((avatar) => (
									<Avatar key={avatar.id} className="border-2 border-border">
										<AvatarImage src={avatar.avatarUrl ?? ""} />
										<AvatarFallback>{getInitials(avatar.name)}</AvatarFallback>
									</Avatar>
								))}
							</div>
							<div className="block text-xs lowercase sm:hidden">{type}</div>
						</div>
					</div>
				</button>
			);
		},
	},
	{
		id: "timestamp",
		cell: ({ row, table }) => {
			const date = row.original.createdAt;
			const formattedDate = formatDistanceToNow(date, {
				addSuffix: true,
			})
				.split(" ")
				.slice(-3)
				.join(" ");

			const isRowHovered =
				(table.options.meta as { hoveredRowId: string | null })
					?.hoveredRowId === row.id;

			const { user } = useUserStore((state) => state);
			const saved = !!user?.savedNotificationIds?.includes(row.original.id);
			const { setNotifications, notifications } = useEventStore(
				(state) => state,
			);

			const { mutate: handleMarkAsDismissed } = useMutation({
				mutationKey: ["notification", "markAsDismissed", row.original.id],
				mutationFn: async () => {
					return await client.notification.dismiss
						.$post({
							notificationIds: [row.original.id],
						})
						.then((res) => res.json());
				},
				onSuccess: (updatedNotifications) => {
					const updatedNotificationsArray = notifications.map(
						(notification) =>
							updatedNotifications.find(
								(updated) => updated.id === notification.id,
							) || notification,
					);

					// Update state with the new array
					setNotifications(updatedNotificationsArray);
				},
			});

			const handleDelete = async () => {
				await client.notification.delete
					.$post({
						notificationIds: [row.original.id],
					})
					.then((res) => res.json());
			};

			const toggleSubscribe = async () => {
				// await updateNotification(row.original.id, { read: true });
				// TODO: Implement toggleSubscribe
			};

			const handleSave = async () => {
				await client.notification.updateUserNotifications.$post({
					notificationIds: [row.original.id],
				});
			};

			return (
				<div className="flex h-full items-center justify-end">
					{!isRowHovered ? (
						<div className="whitespace-nowrap text-right text-muted-foreground text-xs">
							{formattedDate}
						</div>
					) : (
						<div className="flex gap-1">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={() =>
												row.original.dismissed
													? handleDelete()
													: handleMarkAsDismissed()
											}
											variant="secondary"
											size="icon"
											aria-label={
												row.original.dismissed
													? "Delete notification"
													: "Dismiss notification"
											}
											className="size-8 border border-border bg-accent hover:bg-popover"
										>
											{row.original.dismissed ? (
												<Trash2 className="size-4" />
											) : (
												<Check className="size-4" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										{row.original.dismissed
											? "Delete notification"
											: "Dismiss notification"}
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={toggleSubscribe}
											variant="secondary"
											size="icon"
											aria-label="Unsubscribe"
											className="size-8 border border-border bg-accent hover:bg-popover"
										>
											<BellOff className="size-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Unsubscribe</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={handleSave}
											variant="secondary"
											size="icon"
											aria-label="Toggle Bookmark"
											className="size-8 border border-border bg-accent hover:bg-popover"
										>
											{saved ? (
												<BookmarkMinus className="size-4" />
											) : (
												<Bookmark className="size-4" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										{saved ? "Remove from saved" : "Save notification"}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					)}
				</div>
			);
		},
	},
];
