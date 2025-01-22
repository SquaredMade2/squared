import type { Team, Workspace } from "@squared/db";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type MemberWithRole } from "./data-table";

export function MembersPage({
	columns,
	members,
	workspace,
	team,
}: {
	columns: ColumnDef<MemberWithRole, unknown>[];
	members: MemberWithRole[];
	workspace?: Workspace | null;
	team?: Team | null;
}) {
	return (
		<>
			{members.length > 0 && workspace && (
				<DataTable
					columns={columns}
					data={members}
					workspace={workspace}
					team={team ? team : null}
				/>
			)}
		</>
	);
}
