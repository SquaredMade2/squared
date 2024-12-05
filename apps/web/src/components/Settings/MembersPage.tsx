import MemberSettingsWrapper from "@/app/settings/MemberSettingsWrapper";
import type { Team, User, Workspace } from "@squared/db";
import SquaredLoader from "../Loaders/SquaredLoader";

export function MembersPage({
	page,
	isLoading,
	members,
	workspace,
	team,
	admins,
}: {
	page: "workspace" | "team";
	isLoading: boolean;
	members: User[];
	workspace?: Workspace | null;
	team?: Team | null;
	admins: string[];
}) {
	const membersWithRoles = members.map((member) => ({
		...member,
		role: admins.includes(member.id) ? "admin" : "member",
	}));

	if (isLoading) {
		return (
			<MemberSettingsWrapper page={page}>
				<div className="w-full flex justify-center p-20">
					<SquaredLoader />
				</div>
			</MemberSettingsWrapper>
		);
	}
	return (
		<MemberSettingsWrapper page={page}>
			{members.length > 0 && workspace && (
				<DataTable
					columns={columns}
					data={membersWithRoles}
					workspace={workspace}
					team={team}
				/>
			)}
		</MemberSettingsWrapper>
	);
}
