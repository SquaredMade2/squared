import { eventService } from "@/lib/services";
import { useTeamStore, useUserStore, useWorkspaceStore } from "@/store";
import { formatUrl, getInitials } from "@/utils/formatting";
import { TooltipContent } from "@repo/ui/tooltip";
import { TODO } from "@squared/context";
import type { Notification, Task, Workspace } from "@squared/db";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { BellOff, Bookmark, BookmarkMinus, Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusIcon } from "../Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

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
			const { getWorkspace, currentWorkspace } = useWorkspaceStore(
				(state) => state,
			);
			const { getAllTeams, currentTeam } = useTeamStore((state) => state);
			const { userAvatars, user } = useUserStore((state) => state);
			const {
				identifier: taskIdentifier,
				title: taskName,
				teamId,
			} = row.original.Task;
			const taskId = taskIdentifier.split("-")[1];
			const {
				name: workspaceName,
				url: workspaceUrl,
				id: workspaceId,
			} = row.original.Workspace;
			const read = !row.original.read;
			const type = row.original.type;
			const avatars = userAvatars.filter(
				({ id }) =>
					id === row.original.Task.assigneeId ||
					id === row.original.Task.authorId,
			);

			const handleClick = async () => {
				eventService.toggleNotification(TODO, {
					notificationIds: [row.original.id],
					read: true,
				});
				if (currentWorkspace?.id === workspaceId) {
					router.push(
						`/${workspaceUrl}/task/${taskIdentifier}/${formatUrl(taskName)}`,
					);
				} else {
					const { workspace: newWorkspace } = await getWorkspace(workspaceId);
					if (newWorkspace && user) {
						const teams = await getAllTeams(user.id);
						const team = teams.find((t) => t.id === teamId);
						if (team?.id === currentTeam?.id) {
							router.push(
								`/${workspaceUrl}/task/${taskIdentifier}/${formatUrl(taskName)}`,
							);
						} else {
							router.push(
								`/${workspaceUrl}/task/${taskIdentifier}/${formatUrl(taskName)}`,
							);
						}
					}
				}
			};

			return (
				<div
					className="flex items-start sm:items-center gap-4 w-full cursor-pointer"
					onClick={handleClick}
				>
					<div className="flex items-center h-full mt-2 sm:mt-0">
						<StatusIcon status={row.original.Task.status} />
					</div>
					<div className="flex flex-col sm:flex-row justify-between w-full">
						<div
							className={`flex flex-col ${read ? "text-muted-foreground" : ""}`}
						>
							<div className="flex gap-2 text-xxs">
								<div>{workspaceName}</div>
								<div className="text-muted-foreground">#{taskId}</div>
							</div>
							<div>{taskName}</div>
						</div>

						<div className="flex items-center gap-2">
							<div className="text-xs lowercase hidden sm:block">{type}</div>
							<div className="flex -space-x-6">
								{avatars?.map((avatar) => (
									<Avatar key={avatar.id} className="border-2 border-border">
										<AvatarImage src={avatar.avatarUrl ?? ""} />
										<AvatarFallback>{getInitials(avatar.name)}</AvatarFallback>
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

			const { updateUser, getUser, user, setUser } = useUserStore(
				(state) => state,
			);
			const saved = !!user?.savedNotificationIds?.includes(row.original.id);

			const handleDismiss = async () => {
				await eventService.toggleNotification(TODO, {
					notificationIds: [row.original.id],
					dismissed: true,
				});
			};

			const handleDelete = async () => {
				await eventService.deleteNotification(TODO, {
					notificationIds: [row.original.id],
				});
			};

			const toggleSubscribe = async () => {
				// await updateNotification(row.original.id, { read: true });
				// TODO: Implement toggleSubscribe
			};

			const handleSave = async () => {
				const currentUser = user && (await getUser(user.id)).user;
				if (currentUser) {
					setUser(currentUser);
				}
				const response =
					user &&
					(await updateUser(user.id, {
						savedNotificationIds: saved
							? user.savedNotificationIds?.filter(
									(id) => id !== row.original.id,
								)
							: [...(user.savedNotificationIds || []), row.original.id],
					}));
				if (response) {
					setUser(response.user);
				}
			};

			return (
				<div className="flex justify-end items-center h-full">
					{!isRowHovered ? (
						<div className="text-muted-foreground text-xs text-right whitespace-nowrap">
							{formattedDate}
						</div>
					) : (
						<div className="flex gap-1">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={
												row.original.dismissed ? handleDelete : handleDismiss
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
