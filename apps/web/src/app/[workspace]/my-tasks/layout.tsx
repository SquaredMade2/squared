"use client";

import { Button } from "@/components/ui/button";
import {
	// useAuthStore,
	//  useTaskStore,
	useWorkspaceStore,
} from "@/store";
// import type { Task } from "@repo/db";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	//  useEffect,
	useState,
} from "react";

export default function MyTasksLayout({
	children,
}: { children: React.ReactNode }) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"created" | "assigned">(
		"assigned",
	);
	// const { user } = useAuthStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	// const { tasks: initialTasks, getAllTasks } = useTaskStore((state) => state);
	// const [tasks, setTasks] = useState<Task[]>(
	// 	initialTasks.filter((t) => t.assigneeId === user?.id),
	// );

	// useEffect(() => {
	// 	const initiateStore = async () => {
	// 		if (initialTasks) {
	// 			setTasks(initialTasks.filter((t) => t.assigneeId === user?.id));
	// 		} else {
	// 			await getAllTasks(currentWorkspace?.id ?? "");
	// 		}
	// 	};
	// 	initiateStore();
	// }, [user, currentWorkspace]);

	// useEffect(() => {
	// 	switch (activeTab) {
	// 		case "assigned":
	// 			setTasks(initialTasks.filter((t) => t.assigneeId === user?.id));
	// 			break;
	// 		case "created":
	// 			setTasks(initialTasks.filter((t) => t.authorId === user?.id));
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }, [activeTab, initialTasks]);

	return (
		<div className="flex w-full overflow-hidden relative">
			<main className="flex w-full flex-col h-screen flex-grow overflow-hidden container">
				<div className="flex justify-start space-x-4 my-4 items-center">
					<Button size="icon" variant="ghost" onClick={() => router.back()}>
						<ArrowLeft className="size-4" />
					</Button>
					<p className="hidden xl:block">My Tasks</p>
					<Button
						onClick={() => {
							setActiveTab("assigned");
							router.push(`/${currentWorkspace?.url}/my-tasks/assigned`);
						}}
						variant={activeTab === "assigned" ? "secondary" : "ghost"}
						size="sm"
					>
						Assigned
					</Button>
					<Button
						onClick={() => {
							setActiveTab("created");
							router.push(`/${currentWorkspace?.url}/my-tasks/created`);
						}}
						variant={activeTab === "created" ? "secondary" : "ghost"}
						size="sm"
					>
						Created
					</Button>
				</div>
				{children}
			</main>
		</div>
	);
}
