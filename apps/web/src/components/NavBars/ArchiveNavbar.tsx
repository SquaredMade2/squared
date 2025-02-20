"use client";

import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
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
	const { organization } = useOrganization();

	const activeTab = pathname.split("/").pop() as ArchivePaths;

	const navigate = useCallback(
		(path: ArchivePaths) => {
			router.push(`/${organization?.slug}/archive/${path}`);
		},
		[router, organization?.slug],
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
}
