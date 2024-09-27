"use client";

import { useWorkspaceStore } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const MyTasksNavbar = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"created" | "assigned">(
		"assigned",
	);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	return (
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
	);
};
export default MyTasksNavbar;
