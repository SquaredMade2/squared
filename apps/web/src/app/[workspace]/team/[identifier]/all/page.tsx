"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";
import ViewAllTasks from "@/components/ViewAllTasks";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import { Status } from "@repo/db";
import UnassignedColumns from "@/components/ViewAllTasks/UnassignedColumns";

export default function Home() {
	const { view } = useViewStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { currentWorkspace, getAllWorkspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const { tasks, updateTask, getAllTasks } = useTaskStore((state) => state);
	const { currentTeam, getAllTeams, setCurrentTeam } = useTeamStore(
		(state) => state,
	);
	const getAllUsers = useUserStore((state) => state.getAllUsers);
	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(false);

	const params = useParams();

	const workspaceUrl = params.workspace;
	const teamIdentifier = params.identifier;

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
						await getAllTasks(team.id);
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
		await updateTask(updatedTask.id, { status: updatedTask.status });
	};

	const titleArr: { value: Status; id: number }[] = [
		{ value: Status.backlog, id: 1 },
		{ value: Status.todo, id: 2 },
		{ value: Status.inProgress, id: 3 },
		{ value: Status.inReview, id: 4 },
		{ value: Status.done, id: 5 },
	];

	const getFilteredStatuses = () => {
		return titleArr.map((t) => t.value);
	};

	const getTasksForStatus = (status: Status) => {
		return tasks.filter((task) => task.status === status);
	};

	const getEmptyColumns = (): Status[] => {
		const filteredStatuses = getFilteredStatuses();

		return filteredStatuses.filter((status) => {
			if (status === Status.archived) return false;

			const tasks = getTasksForStatus(status);
			return tasks && tasks.length === 0;
		});
	};

	useEffect(() => {
		const loadFilters = async () => {};
		loadFilters();
	}, [currentWorkspace]);

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
			{!authorized ? (
				<div className="flex items-center flex-col w-screen h-full bg-background">
					<div className="w-full h-full flex flex-col items-center justify-center text-foreground">
						<h1 className="text-2xl">Not Authorized</h1>
						<p>
							You are not authorized to access team with identifier{" "}
							{`"${teamIdentifier}"`}
						</p>
					</div>
				</div>
			) : currentWorkspace ? (
				<ScrollArea
					className={`${view === "list" ? "max-h-[calc(100vh-55px)]" : ""} px-2`}
				>
					<div className={"flex flex-grow ml-2"}>
						<ViewAllTasks
							handleDragEnd={handleDragEnd}
							getFilteredStatuses={getFilteredStatuses}
							getTasksForStatus={getTasksForStatus}
						/>
						{view === "grid" && getEmptyColumns().length >= 1 && (
							<div className="ml-auto">
								<UnassignedColumns getEmptyColumns={getEmptyColumns} />
							</div>
						)}
						{view === "grid" && <ScrollBar orientation="horizontal" />}
					</div>
				</ScrollArea>
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
