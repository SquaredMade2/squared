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
} from "@/storeZ/provider";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status } from "@repo/db";
import type { Task } from "@repo/db";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(false);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const router = useRouter();
	const params = useParams();

	const { view } = useViewsStore().getState();
	const { user } = useAuthStore().getState();
	const { tasks, getAllTasks, updateTask, setTaskList, deleteTask } =
		useTaskStore().getState();
	const {
		currentWorkspace,
		getAllWorkspaces,
		workspaces,
		setCurrentWorkspace,
	} = useWorkspaceStore().getState();
	const { currentTeam, teams, getAllTeams, setCurrentTeam } =
		useTeamStore().getState();
	const { getAllUsers } = useUserStore().getState();
	const { currentFilter, filterTasks } = useViewsStore().getState();

	const workspaceUrl = params.workspace;
	const teamIdentifier = params.identifier;

	useEffect(() => {
		const initiateStore = async () => {
			setLoading(true);
			if (!currentWorkspace && !workspaces && user) {
				const workspaces = await getAllWorkspaces(user.id);
				if (workspaces.length) {
					const workspace = workspaces.find(
						(workspace) => workspace.url === workspaceUrl,
					);
					if (workspace) {
						await setCurrentWorkspace(workspace);
					}
				}
			}
			if (user && currentWorkspace) {
				const allUsers = await getAllUsers(currentWorkspace.id);
				const userHasAccess = allUsers.some((u) => u.id === user.id);
				setAuthorized(userHasAccess);
				if (authorized) {
					if (!teams) {
						await getAllTeams(currentWorkspace.id);
					}
					if (teams.length) {
						const team = teams.find(
							(team) => team.identifier === teamIdentifier,
						);
						if (team) {
							setCurrentTeam(team);
							const tasks = await getAllTasks(team.id);
							setFilteredTasks(tasks); // Initially, show all tasks
						}
					}
				}
			}
			setLoading(false);
		};

		initiateStore();
	}, [currentWorkspace, user, workspaces, workspaceUrl]);

	const activeSelected = params.all === "active";
	const backlogSelected = params.all === "backlog";

	const handleDragEnd: OnDragEndResponder = async (result) => {
		const { destination, source, draggableId } = result;

		if (!destination || destination.droppableId === source.droppableId) {
			return;
		}

		const draggedTaskFound = filteredTasks.find(
			(task) => task && task.id === draggableId,
		);

		if (!draggedTaskFound) {
			return;
		}

		const updatedTask = {
			...draggedTaskFound,
			status: destination.droppableId as Status,
		};

		// Update task list in the local state
		const updatedTaskList = filteredTasks.map((task) =>
			task.id === draggableId ? updatedTask : task,
		);

		setFilteredTasks(updatedTaskList);

		// Update task in the backend
		await updateTask(updatedTask.id, { status: updatedTask.status });
	};

	useEffect(() => {
		// Apply filters based on the current filter settings in your Zustand store
		const applyFilters = () => {
			if (currentFilter) {
				const filtered = filterTasks(tasks, currentFilter);
				setFilteredTasks(filtered);
			} else {
				setFilteredTasks(tasks);
			}
		};

		applyFilters();
	}, [tasks]);

	if (loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Loader2 className="animate-spin size-12" />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col h-screen overflow-hidden">
			<div className="w-full px-2 sm:px-5">
				<TopNavBar />
			</div>

			{currentWorkspace ? (
				<div
					className={`flex flex-col flex-grow ${view === "grid" ? "mx-2" : ""}`}
				>
					<ScrollArea
						className={`${view === "list" ? "max-h-[calc(100vh-55px)]" : ""}`}
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
