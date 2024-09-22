"use client";

import ViewAllTasks from "../ViewAllTasks";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
	useAuthStore,
	useTaskStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { Status, Task } from "@repo/db";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import BackButton from "../BackButton";

export default function MyIssues() {
	const [activeTab, setActiveTab] = useState<"created" | "assigned">(
		"assigned",
	);
	const {
		tasks: initialTasks,
		getAllTasks,
		updateTask,
	} = useTaskStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { view } = useViewStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const [tasks, setTasks] = useState<Task[]>(
		initialTasks.filter((t) => t.assigneeId === user?.id),
	);
	useEffect(() => {
		const initiateStore = async () => {
			if (initialTasks) {
				setTasks(initialTasks.filter((t) => t.assigneeId === user?.id));
			} else {
				await getAllTasks(currentWorkspace?.id ?? "");
			}
		};
		initiateStore();
	}, [user, currentWorkspace]);

	useEffect(() => {
		switch (activeTab) {
			case "assigned":
				setTasks(initialTasks.filter((t) => t.assigneeId === user?.id));
				break;
			case "created":
				setTasks(initialTasks.filter((t) => t.authorId === user?.id));
				break;
			default:
				break;
		}
	}, [activeTab, initialTasks]);

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
	// TODO: Refactor TopNavBar to be viable in multiple pages
	// <TopNavBar />;

	return (
		<div className="w-full flex flex-col h-screen overflow-hidden container">
			<div className="flex justify-start space-x-4 my-4 items-center">
				<BackButton hoverbackground="bg-card" />
				<p className="hidden xl:block">My Issues</p>
				<Button
					onClick={() => setActiveTab("assigned")}
					variant={activeTab === "assigned" ? "secondary" : "ghost"}
					size="sm"
				>
					Assigned
				</Button>
				<Button
					onClick={() => setActiveTab("created")}
					variant={activeTab === "created" ? "secondary" : "ghost"}
					size="sm"
				>
					Created
				</Button>
				{/* TODO: Feature not implemented yet */}
				{/* <Button
					// onClick={() => setActiveTab("subscribed")}
					variant="ghost"
				>
					Subscribed
				</Button>
				TODO: Feature not implemented yet
				<Button
					// onClick={() => setActiveTab("activity")}
					variant="ghost"
				>
					Activity
				</Button> */}
			</div>

			{/* <TopNavBar /> */}

			<ScrollArea className={view === "list" ? "max-h-[calc(100vh-55px)]" : ""}>
				<ViewAllTasks handleDragEnd={handleDragEnd} tasks={tasks} />
				{view === "grid" && <ScrollBar orientation="horizontal" />}
			</ScrollArea>
		</div>
	);
}
