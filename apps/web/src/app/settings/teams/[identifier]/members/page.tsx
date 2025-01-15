"use client";

import MemberSettingsWrapper from "@/app/settings/MemberSettingsWrapper";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import type { MemberWithRole } from "@/components/Settings/Members/data-table";
import { useTeams } from "@/hooks/useTeams";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import type { User } from "@squared/db";
import { useEffect, useState } from "react";

export default function TeamMembersPage() {
	const { team, loading: teamLoading } = useTeams();
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const [pageUsers, setPageUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchTeamUsers = async () => {
			if (!team) return;
			const users = await userService.getTeamUsers(TODO, { teamId: team.id });
			setPageUsers(users);
		};
		fetchTeamUsers();
	}, [team]);

	const membersWithRoles: MemberWithRole[] = pageUsers.map((user) => ({
		...user,
		role: workspace?.admins.includes(user.id) ? "admin" : "member",
	}));

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "team",
			pageId: team?.id,
			membersWithRoles,
			setPageUsers,
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
			/>
		</MemberSettingsWrapper>
	);
}
