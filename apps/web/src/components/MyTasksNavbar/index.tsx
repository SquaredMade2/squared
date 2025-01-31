"use client";

import { useWorkspaceStore } from "@/store";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "../ui/button";

const tabs = [
	{ id: "assigned", label: "Assigned" },
	{ id: "created", label: "Created" },
] as const;

type MyTasksPaths = (typeof tabs)[number]["id"];

const MyTasksNavbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const workspace = useWorkspaceStore((state) => state.workspace);

	const activeTab = pathname.split("/").pop() as MyTasksPaths;

	const navigate = useCallback(
		(path: MyTasksPaths) => {
			router.push(`/${workspace?.url}/my-tasks/${path}`);
		},
		[router, workspace?.url],
	);
	return (
		<div className="my-4 flex items-center justify-start space-x-4">
			<Button
				size="icon"
				variant="ghost"
				aria-label="Go back"
				onClick={() => router.back()}
			>
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
