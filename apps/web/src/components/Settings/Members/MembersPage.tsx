import type { Team } from "@squared/db";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type MemberWithRole } from "./data-table";

export function MembersPage({
	columns,
	members,
	team,
}: {
	columns: ColumnDef<MemberWithRole, unknown>[];
	members: MemberWithRole[];
	team?: Team | null;
}) {
	return (
		<>
			{members.length > 0 && (
				<DataTable columns={columns} data={members} team={team ? team : null} />
			)}
		</>
	);
}
