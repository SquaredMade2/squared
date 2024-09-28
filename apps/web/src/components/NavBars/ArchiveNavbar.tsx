"use client";

import { useWorkspaceStore } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const ArchiveNavbar = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<
		"tasks" | "recently-deleted-tasks"
	>("tasks");
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	return (
		<div className="flex justify-start space-x-4 my-4 items-center">
			<Button size="icon" variant="ghost" onClick={() => router.back()}>
				<ArrowLeft className="size-4" />
			</Button>
			<p className="hidden xl:block">My Tasks</p>
			<Button
				onClick={() => {
					setActiveTab("tasks");
					router.push(`/${currentWorkspace?.url}/archive/tasks`);
				}}
				variant={activeTab === "tasks" ? "secondary" : "ghost"}
				size="sm"
			>
				tasks
			</Button>
			<Button
				onClick={() => {
					setActiveTab("recently-deleted-tasks");
					router.push(
						`/${currentWorkspace?.url}/archive/recently-deleted-tasks`,
					);
				}}
				variant={activeTab === "recently-deleted-tasks" ? "secondary" : "ghost"}
				size="sm"
			>
				Recently Deleted Tasks
			</Button>
		</div>
	);
};
export default ArchiveNavbar;
