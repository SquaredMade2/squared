"use client";

import MemberSettingsWrapper from "@/app/settings/MemberSettingsWrapper";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { useTeams } from "@/hooks/useTeams";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import type { User } from "@squared/db";
import { useEffect, useState } from "react";
import type { MemberWithRole } from "./data-table";

export default function TeamMembersPage() {
	const { team, loading: teamLoading } = useTeams();
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const [teamUsers, setTeamUsers] = useState<User[]>([]);
	const isLoading = teamLoading || workspaceLoading;

	useEffect(() => {
		const fetchTeamUsers = async () => {
			if (!team) return;
			const users = await userService.getTeamUsers(TODO, { teamId: team.id });
			setTeamUsers(users);
		};
		fetchTeamUsers();
	}, [team]);

	const membersWithRoles: MemberWithRole[] = teamUsers.map((user) => ({
		...user,
		role: workspace?.admins.includes(user.id) ? "admin" : "member",
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
				page="team"
				isLoading={isLoading}
				members={membersWithRoles}
				team={team}
				workspace={workspace}
				admins={workspace?.admins || []}
			/>
		</MemberSettingsWrapper>
	);
}
