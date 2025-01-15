"use client";

import MemberSettingsWrapper from "@/app/settings/MemberSettingsWrapper";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import type { MemberWithRole } from "@/components/Settings/Members/data-table";
import { useTeams } from "@/hooks/useTeams";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";

export default function TeamMembersPage() {
	const { team, loading: teamLoading } = useTeams();
	const { workspace, loading: workspaceLoading } = useWorkspaces();

	const { data: users = [], refetch } = useQuery({
		queryKey: ["team", team?.id],
		queryFn: async () => {
			if (!team) return;
			return await client.user.getTeamUsers
				.$get({ teamId: team.id })
				.then((res) => res.json());
		},
		enabled: !!team,
	});

	const membersWithRoles: MemberWithRole[] = users.map((user) => ({
		...user,
		role: workspace?.admins.includes(user.externalId) ? "admin" : "member",
	}));

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "team",
			pageId: team?.id,
			membersWithRoles,
			refetch,
		},
	}));

	if (teamLoading || workspaceLoading) {
		return (
			<MemberSettingsWrapper page="team">
				<div className="w-full flex justify-center p-20">
					<SquaredLoader />
				</div>
			</MemberSettingsWrapper>
		);
	}

	return (
		<MemberSettingsWrapper page="team">
			<MembersPage
				columns={enhancedColumns}
				members={membersWithRoles}
				team={team}
				workspace={workspace}
				admins={workspace?.admins || []}
			/>
		</MemberSettingsWrapper>
	);
}
