"use client";

import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function MyTasksLayout({
	children,
}: { children: React.ReactNode }) {
	const router = useRouter();
	const path = usePathname();
	const { currentWorkspace } = useWorkspaceStore((state) => state);

	return (
		<div className="flex w-full overflow-hidden relative">
			<main className="flex w-full flex-col h-screen flex-grow overflow-hidden container">
				<div className="flex justify-start space-x-4 my-4 items-center">
					<Button size="icon" variant="ghost" onClick={() => router.back()}>
						<ArrowLeft className="size-4" />
					</Button>
					<p className="hidden xl:block">My Tasks</p>
					<Button
						onClick={() =>
							router.push(`/${currentWorkspace?.url}/my-tasks/assigned`)
						}
						variant={path.includes("assigned") ? "secondary" : "ghost"}
						size="sm"
					>
						Assigned
					</Button>
					<Button
						onClick={() =>
							router.push(`/${currentWorkspace?.url}/my-tasks/created`)
						}
						variant={path.includes("created") ? "secondary" : "ghost"}
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
