"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { LabelsPage } from "@/components/Settings/Labels/LabelsPage";
import { columns } from "@/components/Settings/Labels/columns";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Separator } from "@squaredmade/ui/separator";

export default function WorkspaceLabelsPage() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const workspaceLabels = workspace ? workspace.labels : [];

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: { page: "workspaceLabels" },
	}));

	if (workspaceLoading) {
		return <SquaredLoader />;
	}

	return (
		<div className="container flex w-full flex-col gap-4 py-8 md:w-3/4">
			<div className="flex flex-col items-start gap-2">
				<h1 className="text-2xl">Labels</h1>
				<p className="text-muted-foreground text-xs">
					Manage labels for this workspace
				</p>
			</div>
			<Separator className="mb-8" />
			<LabelsPage
				columns={enhancedColumns}
				labels={workspaceLabels}
				workspace={workspace}
			/>
		</div>
	);
}
