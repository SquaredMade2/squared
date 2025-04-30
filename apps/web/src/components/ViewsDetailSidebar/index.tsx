import { client } from "@/lib/client";
import {
	useFilterStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import type { SavedFilter } from "@/store/filters";
import { getInitials } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";
import type { Task } from "@squaredmade/db";
import { Info, Trash } from "@squaredmade/icons";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
} from "@squaredmade/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Badge } from "@squaredmade/ui/badge";
import { Button } from "@squaredmade/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@squaredmade/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@squaredmade/ui/tabs";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LabelBadge from "../LabelBadges";

interface ViewsDetailSidebarProps {
	filter: SavedFilter;
	filterTasksWithFilter: (task: Task[]) => Task[];
}

const ViewsDetailSidebar = ({
	filter,
	filterTasksWithFilter,
}: ViewsDetailSidebarProps) => {
	const router = useRouter();
	const { users } = useUserStore((state) => state);
	const { team } = useTeamStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);
	const { tasks } = useTaskStore((state) => state);
	const { deleteSavedFilter } = useFilterStore((state) => state);
	const filteredTasks = filterTasksWithFilter(tasks);
	const allLabels = workspace?.labels;
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const author = users.find((u) => u.externalId === filter.authorId);

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
			for (const label of task.labels) {
				labelCount[label.name] = (labelCount[label.name] || 0) + 1;
			}
		}
		return Object.entries(labelCount).map(([name, count]) => ({
			name,
			count,
		}));
	};

	const assigneeCount = getAssigneeCount();
	const labelCount = getLabelCount();

	const { mutate: handleDeleteSavedFilter, isPending } = useMutation({
		mutationKey: ["filter", "deleteFilter", filter.id],
		mutationFn: async () => {
			await client.filter.deleteFilter.$post({ filterId: filter.id });
		},
		onSuccess: () => {
			deleteSavedFilter(filter.id);
			toast.success("Filter Deleted", {
				description: "The filter has been successfully deleted.",
			});
			router.back();
		},
		onError: (error) => {
			toast.error("Error deleting filter", {
				description: parseError(
					error,
					"An error occurred while deleting the filter.",
				),
			});
		},
	});

	return (
		<div>
			<Card className="w-[300px]">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="flex items-center gap-2 font-medium text-sm">
						<Info className="h-4 w-4" />
						{filter.name}
					</CardTitle>
					<Button variant="ghost" onClick={() => setShowDeleteDialog(true)}>
						<Trash className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-muted-foreground text-xs">
						{filter.description}
					</p>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-xs">Visibility</span>
							<Badge variant="outline" className="">
								{team?.name}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-xs">Owner</span>
							<div className="flex items-center gap-2">
								<Avatar className="size-6 shrink-0">
									<AvatarImage src={author?.avatarUrl ?? ""} />
									<AvatarFallback className="text-xxs">
										{author && getInitials(author.name)}
									</AvatarFallback>
								</Avatar>
								<span className="text-xs">{author?.username}</span>
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
								const foundLabel = allLabels?.find(
									({ name }) => name === label.name,
								);
								return (
									<div
										key={label.name}
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
						Are you sure you want to delete {`${filter.name}`}?
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive"
							disabled={isPending}
							onClick={() => handleDeleteSavedFilter()}
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
