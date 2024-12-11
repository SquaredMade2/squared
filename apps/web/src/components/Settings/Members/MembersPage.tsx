import type { Team, User, Workspace } from "@squared/db";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type MemberWithRole } from "./data-table";

export function MembersPage({
	columns,
	members,
	workspace,
	team,
	admins,
}: {
	columns: ColumnDef<MemberWithRole, unknown>[];
	members: User[];
	workspace?: Workspace | null;
	team?: Team | null;
	admins: string[];
}) {
	const membersWithRoles: MemberWithRole[] = members.map((member) => ({
		...member,
		role: admins.includes(member.id) ? "admin" : "member",
	}));

	return (
		<>
			{members.length > 0 && workspace && (
				<DataTable
					columns={columns}
					data={membersWithRoles}
					workspace={workspace}
					team={team ? team : null}
				/>
			)}
		</>
	);
}
