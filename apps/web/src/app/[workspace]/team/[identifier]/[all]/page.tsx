"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";
import ViewAllTasks from "@/components/ViewAllTasks";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import {
	type Task,
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useViewsStore,
	useWorkspaceStore,
} from "@/storeZ";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { SavedFilter, Status } from "@repo/db";
import type { FilterCondition } from "@/storeZ/views";

export default function Home() {
	const { view, currentFilter, addFilter, filterTasks } = useViewsStore(
		(state) => state,
	);
	const { user } = useAuthStore((state) => state);
	const {
		currentWorkspace,
		getAllWorkspaces,
		setCurrentWorkspace,
		getWorkspaceFilters,
	} = useWorkspaceStore((state) => state);
	const {
		tasks: initialTasks,
		updateTask,
		getAllTasks,
	} = useTaskStore((state) => state);
	const { currentTeam, getAllTeams, setCurrentTeam } = useTeamStore(
		(state) => state,
	);
	const getAllUsers = useUserStore((state) => state.getAllUsers);
	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(false);
	const [tasks, setTasks] = useState(initialTasks);
	const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

	const params = useParams();

	const workspaceUrl = params.workspace;
	const teamIdentifier = params.identifier;

	const applyFilters = () => {
		if (currentFilter) {
			setTasks(filterTasks(initialTasks, currentFilter)); // Directly update tasks with filtered result
		} else {
			setTasks(initialTasks); // Reset to initial tasks if no filter
		}
	};

	// Combining loading logic in a single useEffect
	useEffect(() => {
		const initiateStore = async () => {
			setLoading(true);

			if (user && !currentWorkspace) {
				const workspaces = await getAllWorkspaces(user.id);
				const workspace = workspaces?.find((ws) => ws.url === workspaceUrl);
				workspace && setCurrentWorkspace(workspace);
			}

			if (user && currentWorkspace) {
				const allUsers = await getAllUsers(currentWorkspace.id);
				const userHasAccess = allUsers.some((u) => u.id === user.id);
				setAuthorized(userHasAccess);

				if (userHasAccess && currentTeam?.identifier !== teamIdentifier) {
					const teams = await getAllTeams(currentWorkspace.id);
					const team = teams.find((t) => t.identifier === teamIdentifier);
					team && setCurrentTeam(team);

					if (team) {
						const tasks = await getAllTasks(team.id);
						setTasks(tasks);
					}
				}
			}

			setLoading(false);
		};

		initiateStore();
	}, [currentWorkspace, user, workspaceUrl, currentTeam, teamIdentifier]);

	const handleDragEnd: OnDragEndResponder = async ({
		destination,
		source,
		draggableId,
	}) => {
		if (!destination || destination.droppableId === source.droppableId) return;

		const draggedTask = tasks.find((task) => task.id === draggableId);
		if (!draggedTask) return;

		const updatedTask = {
			...draggedTask,
			status: destination.droppableId as Status,
		};
		const updatedTasks = tasks.map((task) =>
			task.id === draggableId ? updatedTask : task,
		);
		setTasks(updatedTasks); // Directly set updated tasks
		await updateTask(updatedTask.id, { status: updatedTask.status }); // Backend update
	};

	useEffect(() => {
		const loadFilters = async () => {
			const filters =
				currentWorkspace && (await getWorkspaceFilters(currentWorkspace.id));
			setSavedFilters(filters ?? []);
		};
		loadFilters();
	}, [currentWorkspace]);

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
							tasks={tasks}
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
