"use client";

import { useWorkspaceStore } from "@/store";
import { Button } from "@squaredmade/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const tabs = [
	{ id: "tasks", label: "Tasks" },
	{ id: "recently-deleted-tasks", label: "Recently Deleted Tasks" },
] as const;

type ArchivePaths = (typeof tabs)[number]["id"];

export default function ArchiveNavbar() {
	const router = useRouter();
	const pathname = usePathname();
	const workspace = useWorkspaceStore((state) => state.workspace);

	const activeTab = pathname.split("/").pop() as ArchivePaths;

	const navigate = useCallback(
		(path: ArchivePaths) => {
			router.push(`/${workspace?.url}/archive/${path}`);
		},
		[router, workspace?.url],
	);

	return (
		<div className="flex justify-start space-x-4 my-4 items-center">
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
}
