"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";
import ViewAllTasks from "@/components/ViewAllTasks";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useViewsStore,
	useWorkspaceStore,
} from "@/storeZ";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@repo/db";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(false);
	const { tasks, getAllTasks, setTaskList } = useTaskStore((state) => state);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

	const params = useParams();

	// Using Zustand hooks to subscribe to changes
	const { view, currentFilter, filterTasks } = useViewsStore((state) => state);
	const { user } = useAuthStore((state) => state);

	const { currentWorkspace, getAllWorkspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);

	const { currentTeam, getAllTeams, setCurrentTeam } = useTeamStore(
		(state) => state,
	);

	const getAllUsers = useUserStore((state) => state.getAllUsers);

	const workspaceUrl = params.workspace;
	const teamIdentifier = params.identifier;

	// Combining loading logic in a single useEffect
	useEffect(() => {
		const initiateStore = async () => {
			setLoading(true);

			// Fetch workspaces if not already present
			if (!currentWorkspace && user) {
				const workspaces = await getAllWorkspaces(user.id);
				const workspace = workspaces?.find((ws) => ws.url === workspaceUrl);
				if (workspace) {
					setCurrentWorkspace(workspace);
				}
			}

			// Fetch teams and tasks when the workspace is set
			if (user && currentWorkspace) {
				const allUsers = await getAllUsers(currentWorkspace.id);
				const userHasAccess = allUsers.some((u) => u.id === user.id);
				setAuthorized(userHasAccess);
				if (userHasAccess && currentTeam?.identifier !== teamIdentifier) {
					const teams = await getAllTeams(currentWorkspace.id);
					const team = teams.find((t) => t.identifier === teamIdentifier);
					if (team) {
						setCurrentTeam(team);
						const tasks = await getAllTasks(team.id);
						setFilteredTasks(tasks);
					}
				}
			}

			setLoading(false);
		};

		initiateStore();
	}, [
		currentWorkspace,
		user,
		getAllWorkspaces,
		setCurrentWorkspace,
		workspaceUrl,
		currentTeam,
		getAllTeams,
		teamIdentifier,
		getAllUsers,
		setCurrentTeam,
		getAllTasks,
	]);

	const handleDragEnd: OnDragEndResponder = async (result) => {
		const { destination, source, draggableId } = result;

		// If no destination or task was dropped in the same position, do nothing
		if (!destination) {
			return;
		}

		// Find the dragged task
		const draggedTaskFound = filteredTasks.find(
			(task) => task && task.id === draggableId,
		);

		if (!draggedTaskFound) {
			return;
		}

		// If the task was dropped in the same column but reordered
		if (destination.droppableId === source.droppableId) {
			// Reorder tasks within the same column
			const tasksInSameStatus = filteredTasks.filter(
				(task) => task.status === source.droppableId,
			);

			const reorderedTasks = [...tasksInSameStatus];
			const [movedTask] = reorderedTasks.splice(source.index, 1);
			reorderedTasks.splice(destination.index, 0, movedTask);

			// Update displayOrder based on new positions
			const updatedReorderedTasks = reorderedTasks.map((task, index) => ({
				...task,
				displayOrder: index,
			}));

			// Update the task list in local state and backend
			await setTaskList(
				filteredTasks.map((task) =>
					task.status === source.droppableId
						? updatedReorderedTasks.find((t) => t.id === task.id) || task
						: task,
				),
			);

			return;
		}

		// If the task was moved to a different column (status)
		const tasksInSourceStatus = filteredTasks.filter(
			(task) => task.status === source.droppableId,
		);
		const tasksInDestinationStatus = filteredTasks.filter(
			(task) => task.status === destination.droppableId,
		);

		// Remove task from source status and insert it into destination status
		const updatedSourceTasks = [...tasksInSourceStatus];
		updatedSourceTasks.splice(source.index, 1);

		const updatedDestinationTasks = [...tasksInDestinationStatus];
		updatedDestinationTasks.splice(destination.index, 0, {
			...draggedTaskFound,
			status: destination.droppableId as Status,
		});

		// Update displayOrder for tasks in both columns
		const updatedSourceReordered = updatedSourceTasks.map((task, index) => ({
			...task,
			displayOrder: index,
		}));

		const updatedDestinationReordered = updatedDestinationTasks.map(
			(task, index) => ({
				...task,
				displayOrder: index,
			}),
		);

		// Update the task list in local state and backend
		await setTaskList(
			filteredTasks.map((task) =>
				task.id === draggableId
					? {
							...task,
							status: destination.droppableId as Status,
							displayOrder: destination.index,
						}
					: task.status === source.droppableId
						? updatedSourceReordered.find((t) => t.id === task.id) || task
						: task.status === destination.droppableId
							? updatedDestinationReordered.find((t) => t.id === task.id) ||
								task
							: task,
			),
		);
	};

	// Apply filters whenever tasks or currentFilter change
	useEffect(() => {
		if (currentFilter) {
			setFilteredTasks(filterTasks(tasks, currentFilter));
		} else {
			setFilteredTasks(tasks);
		}
	}, [tasks, currentFilter, filterTasks]);

	if (loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Loader2 className="animate-spin size-12" />
			</div>
		);
	}

	const activeSelected = params.all === "active";
	const backlogSelected = params.all === "backlog";

	return (
		<div className="w-full flex flex-col h-screen overflow-hidden">
			<div className="w-full px-2 sm:px-5">
				<TopNavBar />
			</div>

			{currentWorkspace ? (
				<div className={"flex flex-col flex-grow mx-2"}>
					<ScrollArea
						className={`${view === "list" ? "max-h-[calc(100vh-55px)]" : ""} px-2`}
					>
						<ViewAllTasks
							activeSelected={activeSelected}
							backlogSelected={backlogSelected}
							handleDragEnd={handleDragEnd}
							tasks={filteredTasks}
						/>
						{view === "grid" && <ScrollBar orientation="horizontal" />}
					</ScrollArea>
				</div>
			) : (
				<div className="flex items-center flex-col w-screen h-full bg-background">
					<div className="w-full h-full flex flex-col items-center justify-center text-foreground">
						<h1 className="text-2xl">Team not found</h1>
						<p>There is no team with identifier {`"${teamIdentifier}"`}</p>
					</div>
				</div>
			)}
		</div>
	);
}
