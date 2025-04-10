import type { Label, Workspace } from "@squaredmade/db";

import { useOrganization } from "@clerk/nextjs";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";

export function LabelsPage({
	columns,
	labels,
	workspace,
}: {
	columns: ColumnDef<Label, unknown>[];
	labels: Label[];
	workspace?: Workspace | null;
}) {
	const { membership } = useOrganization();
	const hasWorkspaceManagePermission = membership?.permissions.includes(
		"org:sys_profile:manage",
	);
	return (
		<>
			{labels.length > 0 && workspace && (
				<DataTable
					columns={columns}
					data={labels}
					workspaceManagePermission={hasWorkspaceManagePermission}
				/>
			)}
		</>
	);
}
