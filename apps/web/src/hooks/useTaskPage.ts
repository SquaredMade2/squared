import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { Status, type Task } from "@repo/db";
import type { OnDragEndResponder } from "@hello-pangea/dnd";

export function useTaskPage(filterTasks: (tasks: Task[]) => Task[]) {
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
	const teamIdentifier = Array.isArray(params.identifier)
		? params.identifier[0]
		: params.identifier;

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
		return filterTasks(tasks).filter((task) => task.status === status);
	};

	return {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	};
}
