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
	Notification & { task: Task; workspace: Workspace }
>[] = [
	{
		cell: ({ row }) => (
			<Checkbox
				aria-label="Select row"
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
			/>
		),
		enableHiding: false,
		enableSorting: false,
		id: "select",
	},
	{
		accessorFn: (row) => row.task.title,
		accessorKey: "taskTitle",
		enableHiding: false,
	},
	{
		accessorFn: (row) => row.read,
		accessorKey: "read",
		enableHiding: false,
	},
	{
		cell: ({ row }) => {
			const router = useRouter();
			const { identifier: taskIdentifier, title: taskName } = row.original.task;
			const { userAvatars } = useUserStore((state) => state);

			const taskId = taskIdentifier.split("-")[1];
			const { name: workspaceName, url: workspaceUrl } = row.original.workspace;
			const read = !row.original.read;
			const type = row.original.type;
			const avatars = userAvatars.filter(
				({ id }) =>
					id === row.original.task.assigneeId ||
					id === row.original.task.authorId,
			);

			const { mutate: handleMarkAsUnread } = useMutation({
				mutationFn: async () => {
					await client.notification.markAsUnread.$post({
						notificationIds: [row.original.id],
					});
				},
				mutationKey: ["notification", "markAsUnread", row.original.id],
				onSuccess: () => {
					router.push(
						`/${workspaceUrl}/task/${taskIdentifier}/${formatUrl(taskName)}`,
					);
				},
			});

			return (
				<button
					className="flex w-full cursor-pointer items-start gap-4 sm:items-center"
					onClick={() => handleMarkAsUnread()}
					type="button"
				>
					<div className="mt-2 flex h-full items-center sm:mt-0">
						<StatusIcon status={row.original.task.status} />
					</div>
					<div className="flex w-full flex-col justify-between sm:flex-row">
						<div
							className={`flex flex-col ${read ? "" : "text-muted-foreground"}`}
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
									<Avatar className="border-2 border-border" key={avatar.id}>
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
		id: "content",
	},
	{
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
				mutationFn: async () => {
					return await client.notification.dismiss
						.$post({
							notificationIds: [row.original.id],
						})
						.then((res) => res.json());
				},
				mutationKey: ["notification", "markAsDismissed", row.original.id],
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
					{isRowHovered ? (
						<div className="flex gap-1">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											aria-label={
												row.original.dismissed
													? "Delete notification"
													: "Dismiss notification"
											}
											className="size-8 border border-border bg-accent hover:bg-popover"
											onClick={() =>
												row.original.dismissed
													? handleDelete()
													: handleMarkAsDismissed()
											}
											size="icon"
											variant="secondary"
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
											aria-label="Unsubscribe"
											className="size-8 border border-border bg-accent hover:bg-popover"
											onClick={toggleSubscribe}
											size="icon"
											variant="secondary"
										>
											<BellOff className="size-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Unsubscribe</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											aria-label="Toggle Bookmark"
											className="size-8 border border-border bg-accent hover:bg-popover"
											onClick={handleSave}
											size="icon"
											variant="secondary"
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
					) : (
						<div className="whitespace-nowrap text-right text-muted-foreground text-xs">
							{formattedDate}
						</div>
					)}
				</div>
			);
		},
		id: "timestamp",
	},
];
