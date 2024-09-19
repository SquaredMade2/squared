import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useId } from "react";
import {
	useNotificationStore,
	type NotificationTask,
} from "@/store/notifications";
import { getStatusIcon } from "@/utils/enumIcons";
import { Button } from "../ui/button";
import { Check, BellOff, Bookmark, BookmarkMinus } from "lucide-react";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatUrl, getInitials } from "@/utils/formatting";

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
			const { updateNotification } = useNotificationStore((state) => state);
			const { getAllTasks } = useTaskStore((state) => state);
			const { userAvatars } = useUserStore((state) => state);
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
				updateNotification(row.original.id, { read });
				if (currentWorkspace?.id === workspaceId) {
					router.push(
						`/${workspaceUrl}/task/${taskIdentifier}/${formatUrl(taskName)}`,
					);
				} else {
					const { workspace: newWorkspace } = await getWorkspace(workspaceId);
					if (newWorkspace) {
						const teams = await getAllTeams(newWorkspace.id);
						const team = teams.find((t) => t.id === teamId);
						if (team?.id === currentTeam?.id) {
							router.push(
								`/${workspaceUrl}/task/${taskIdentifier}/${formatUrl(taskName)}`,
							);
						} else {
							await getAllTasks(teamId);
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
						{getStatusIcon(row.original.Task.status)}
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

			const { updateNotification } = useNotificationStore((state) => state);
			const { updateUser, getUser } = useUserStore((state) => state);
			const { user, setUser } = useAuthStore((state) => state);
			const saved = !!user?.savedNotificationIds?.includes(row.original.id);

			const handleDismiss = async () => {
				await updateNotification(row.original.id, { dismissed: true });
			};

			const handleUnsubscribe = async () => {
				await updateNotification(row.original.id, { read: true });
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
							<Button
								onClick={handleDismiss}
								variant="secondary"
								size="icon"
								className="size-8 border border-border bg-accent"
							>
								<Check className="size-4" />
							</Button>
							<Button
								onClick={handleUnsubscribe}
								variant="secondary"
								size="icon"
								className="size-8 border border-border bg-accent"
							>
								<BellOff className="size-4" />
							</Button>
							<Button
								onClick={handleSave}
								variant="secondary"
								size="icon"
								className="size-8 border border-border bg-accent"
							>
								{saved ? (
									<BookmarkMinus className="size-4" />
								) : (
									<Bookmark className="size-4" />
								)}
							</Button>
						</div>
					)}
				</div>
			);
		},
	},
];
