"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";
import ViewAllTasks from "@/components/ViewAllTasks";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import {
	useAuthStore,
	useFilterStore,
	useTaskStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@repo/db";
import { Button } from "@/components/ui/button";

export default function MyIssues() {
	const { view } = useViewStore((state) => state);
	const { filterTasks } = useFilterStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { currentWorkspace, getAllWorkspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const {
		tasks: initialTasks,
		updateTask,
		getAllTasks,
	} = useTaskStore((state) => state);
	const [loading, setLoading] = useState(true);
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [activeTab, setActiveTab] = useState<"assigned" | "created">(
		"assigned",
	);

	const router = useRouter();

	useEffect(() => {
		const initiateStore = async () => {
			setLoading(true);

			if (user && !currentWorkspace) {
				const workspaces = await getAllWorkspaces(user.id);
				const workspace = workspaces?.[0];
				workspace && setCurrentWorkspace(workspace);
			}

			if (user && currentWorkspace) {
				const allTasks = await getAllTasks(currentWorkspace.id);
				const filteredTasks = allTasks.filter((task) => {
					switch (activeTab) {
						case "assigned":
							return task.assigneeId === user.id;
						case "created":
							return task.authorId === user.id;
						default:
							return false;
					}
				});
				setTasks(filteredTasks);
			}

			setLoading(false);
		};

		initiateStore();
	}, [user, currentWorkspace, activeTab]);

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
		setTasks(updatedTasks);
		await updateTask(updatedTask.id, { status: updatedTask.status });
	};

	if (loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Loader2 className="animate-spin size-12" />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col h-screen overflow-hidden container">
			<div className="flex justify-start space-x-4 my-4 items-center">
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
				<Button
					onClick={() => router.push("/my-issues/subscribed")}
					variant="ghost"
				>
					Subscribed
				</Button>
				{/* TODO: Feature not implemented yet */}
				<Button
					onClick={() => router.push("/my-issues/activity")}
					variant="ghost"
				>
					Activity
				</Button>
			</div>

			<TopNavBar />

			<ScrollArea className={view === "list" ? "max-h-[calc(100vh-55px)]" : ""}>
				<ViewAllTasks
					handleDragEnd={handleDragEnd}
					tasks={filterTasks(tasks)}
				/>
				{view === "grid" && <ScrollBar orientation="horizontal" />}
			</ScrollArea>
		</div>
	);
}
