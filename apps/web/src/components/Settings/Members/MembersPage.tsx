import type { Team, User, Workspace } from "@squared/db";
import { columns } from "./columns";
import { DataTable, type MemberWithRole } from "./data-table";

export function MembersPage({
	members,
	workspace,
	team,
	admins,
}: {
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
