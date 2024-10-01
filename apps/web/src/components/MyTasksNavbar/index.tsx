"use client";

import { useWorkspaceStore } from "@/store";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const tabs = [
	{ id: "assigned", label: "Assigned" },
	{ id: "created", label: "Created" },
] as const;

type MyTasksPaths = (typeof tabs)[number]["id"];

const MyTasksNavbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { currentWorkspace } = useWorkspaceStore((state) => state);

	const activeTab = pathname.split("/").pop() as MyTasksPaths;

	const navigate = useCallback(
		(path: MyTasksPaths) => {
			router.push(`/${currentWorkspace?.url}/my-tasks/${path}`);
		},
		[router, currentWorkspace?.url],
	);
	return (
		<div className="flex justify-start space-x-4 my-4 items-center">
			<Button size="icon" variant="ghost" onClick={() => router.back()}>
				<ArrowLeft className="size-4" />
			</Button>
			<p className="hidden xl:block">My Tasks</p>
			{tabs.map((tab) => (
				<Button
					key={tab.id}
					onClick={() => navigate(tab.id)}
					variant={activeTab === tab.id ? "secondary" : "ghost"}
					size="sm"
				>
					{tab.label}
				</Button>
			))}
		</div>
	);
};
export default MyTasksNavbar;
