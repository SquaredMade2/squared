"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { Separator } from "@/components/ui/separator";
import { useTeams } from "@/hooks/useTeams";
import { userService } from "@/lib/services";

import { useWorkspaces } from "@/hooks/useWorkspaces";
import { TODO } from "@squared/context";
import type { User } from "@squared/db";
import { type ReactNode, useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable, type MemberWithRole } from "./data-table";

export default function TeamMembersPage() {
	const { team, loading: teamLoading } = useTeams();
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const [teamUsers, setTeamUsers] = useState<User[]>([]);

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
			<MemberSettingsWrapper>
				<div className="w-full flex justify-center p-20">
					<SquaredLoader />
				</div>
			</MemberSettingsWrapper>
		);
	}

	return (
		<MemberSettingsWrapper>
			{teamUsers && (
				<DataTable columns={columns} data={membersWithRoles} team={team} />
			)}
		</MemberSettingsWrapper>
	);
}

const MemberSettingsWrapper = ({ children }: { children: ReactNode }) => (
	<div className="md:w-3/4 w-full flex flex-col py-8 container gap-4">
		<div className="flex flex-col gap-2 items-start">
			<h1 className="text-2xl">Members</h1>
			<p className="text-xs text-muted-foreground">
				Manage members for this team
			</p>
		</div>
		<Separator className="mb-8" />
		{children}
	</div>
);
