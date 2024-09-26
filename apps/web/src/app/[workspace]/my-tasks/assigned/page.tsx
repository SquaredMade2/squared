// assigned/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ViewAllTasks from "@/components/ViewAllTasks";
import {
	useAuthStore,
	useTaskStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import { Status, type Task } from "@repo/db";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function MyAssignedTasksPage() {
	const router = useRouter();
	const path = usePathname();
	const isAssignedPath = path.includes("assigned");
	const { view } = useViewStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { tasks: initialTasks, updateTask } = useTaskStore((state) => state);
	const [tasks, setTasks] = useState<Task[]>(
		initialTasks.filter((t) => t.assigneeId === user?.id),
	);

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
		setTasks(updatedTasks); // directly set updated tasks in local state
		await updateTask(updatedTask.id, { status: updatedTask.status }); //backend update
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

	return (
		<div className="w-full flex flex-col h-screen overflow-hidden container">
			<div className="flex justify-start space-x-4 my-4 items-center">
				<Button size="icon" variant="ghost" onClick={() => router.back()}>
					<ArrowLeft className="size-4" />
				</Button>
				<p className="hidden xl:block">My Tasks</p>
				<Button
					onClick={() =>
						router.push(`/${currentWorkspace?.url}/my-tasks/assigned`)
					}
					variant={isAssignedPath ? "secondary" : "ghost"}
					size="sm"
				>
					Assigned
				</Button>
				<Button
					onClick={() =>
						router.push(`/${currentWorkspace?.url}/my-tasks/created`)
					}
					variant={!isAssignedPath ? "secondary" : "ghost"}
					size="sm"
				>
					Created
				</Button>
			</div>
			<ScrollArea className={view === "list" ? "max-h-[calc(100vh-55px)]" : ""}>
				<DragDropContext onDragEnd={handleDragEnd}>
					<ViewAllTasks
						getFilteredStatuses={getFilteredStatuses}
						getTasksForStatus={getTasksForStatus}
					/>
					{view === "grid" && <ScrollBar orientation="horizontal" />}
				</DragDropContext>
			</ScrollArea>
		</div>
	);
}
