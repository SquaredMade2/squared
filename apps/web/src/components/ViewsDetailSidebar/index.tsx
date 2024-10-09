import { useRouter } from "next/navigation";
import { useState } from "react";
import { Info, MoreHorizontal, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
} from "../ui/alert-dialog";
import type { SavedFilter } from "@/store/filters";
import {
	useAuthStore,
	useFilterStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import type { Task } from "@repo/db";
import LabelBadge from "../LabelBadges";
import { getInitials } from "@/utils/formatting";

const ViewsDetailSidebar = ({
	filter,
	filterTasksWithFilter,
}: {
	filter: SavedFilter;
	filterTasksWithFilter: (task: Task[]) => Task[];
}) => {
	const router = useRouter();
	const { user } = useAuthStore((state) => state);
	const { users } = useUserStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { tasks } = useTaskStore((state) => state);
	const { deleteSavedFilter } = useFilterStore((state) => state);
	const filteredTasks = filterTasksWithFilter(tasks);
	const allLabels = currentWorkspace?.Labels;
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const getAssigneeCount = () => {
		const assigneeCount: Record<string, number> = {};
		for (const task of filteredTasks) {
			const assigneeId = task.assigneeId || "Unassigned";
			assigneeCount[assigneeId] = (assigneeCount[assigneeId] || 0) + 1;
		}
		return Object.entries(assigneeCount).map(([id, count]) => ({
			id,
			count,
		}));
	};

	const getLabelCount = () => {
		const labelCount: Record<string, number> = {};
		for (const task of filteredTasks) {
			for (const labelId of task.labels) {
				labelCount[labelId] = (labelCount[labelId] || 0) + 1;
			}
		}
		return Object.entries(labelCount).map(([id, count]) => ({
			id,
			count,
		}));
	};

	const assigneeCount = getAssigneeCount();
	const labelCount = getLabelCount();

	const handleDeleteSavedFilter = () => {
		deleteSavedFilter(filter.id);
		router.back();
	};

	return (
		<div>
			<Card className="w-[300px]">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium flex items-center gap-2">
						<Info className="h-4 w-4" />
						{filter.name}
					</CardTitle>
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4" />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<MoreHorizontal className="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Edit</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-xs text-muted-foreground mb-4">
						{filter.description}
					</p>
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-xs">Visibility</span>
							<Badge variant="outline" className="">
								{currentTeam?.name}
							</Badge>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-xs">Owner</span>
							<div className="flex items-center gap-2">
								<Avatar className="size-6 flex-shrink-0">
									<AvatarImage src={user?.avatarUrl ?? ""} />
									<AvatarFallback className="text-xxs">
										{user && getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<span className="text-xs">{user?.username}</span>
							</div>
						</div>
					</div>
					<Tabs defaultValue="assignees" className="mt-4">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="assignees" className="text-xs">
								Assignees
							</TabsTrigger>
							<TabsTrigger value="labels" className="text-xs">
								Labels
							</TabsTrigger>
						</TabsList>
						<TabsContent value="assignees" className="mt-2">
							{assigneeCount.map((assignee) => {
								const foundAssignee = users.find(
									({ id }) => id === assignee.id,
								);
								return (
									<div
										key={assignee.id}
										className="flex items-center justify-between py-2"
									>
										{foundAssignee && (
											<div className="flex items-center gap-2">
												<Avatar className="size-6">
													<AvatarImage src={foundAssignee?.avatarUrl ?? ""} />
													<AvatarFallback className="text-xxs">
														{getInitials(foundAssignee.name)}
													</AvatarFallback>
												</Avatar>
												<span className="text-xs">{foundAssignee.name}</span>
											</div>
										)}
										<span className="text-xs">{assignee.count}</span>
									</div>
								);
							})}
						</TabsContent>
						<TabsContent value="labels" className="mt-2">
							{labelCount.map((label) => {
								const foundLabel = allLabels?.find(({ id }) => id === label.id);
								return (
									<div
										key={label.id}
										className="flex items-center justify-between py-2"
									>
										<div className="flex items-center gap-2">
											{foundLabel && <LabelBadge label={foundLabel} />}
										</div>
										<span className="text-xs">{label.count}</span>
									</div>
								);
							})}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						Are you sure you want to delete the view "{`${filter.name}`}"?
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive"
							onClick={handleDeleteSavedFilter}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default ViewsDetailSidebar;
