"use client";

import { useOrganization } from "@clerk/nextjs";
import { ArrowLeft } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const tabs = [
	{ id: "assigned", label: "Assigned" },
	{ id: "created", label: "Created" },
] as const;

type MyTasksPaths = (typeof tabs)[number]["id"];

const MyTasksNavbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { organization } = useOrganization();

	const activeTab = pathname.split("/").pop() as MyTasksPaths;

	const navigate = useCallback(
		(path: MyTasksPaths) => {
			router.push(`/${organization?.slug}/my-tasks/${path}`);
		},
		[router, organization?.slug],
	);
	return (
		<div className="my-3 flex items-center justify-start space-x-4">
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
