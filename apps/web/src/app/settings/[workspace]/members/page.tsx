"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import type { MemberWithRole } from "@/components/Settings/Members/data-table";
import { useUsers } from "@/hooks/useUsers";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useState } from "react";
import MemberSettingsWrapper from "../../MemberSettingsWrapper";

export default function WorkspaceMembersPage() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { users, loading: userLoading } = useUsers();
	const [pageUsers, setPageUsers] = useState(users);

	const membersWithRoles: MemberWithRole[] = workspace
		? pageUsers.map((user) => ({
				...user,
				role: workspace.admins.includes(user.id) ? "admin" : "member",
			}))
		: [];

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "workspace",
			pageId: workspace?.id,
			membersWithRoles,
			setPageUsers,
		},
	}));
    
	if (workspaceLoading || userLoading) {
		return (
			<MemberSettingsWrapper page="workspace">
				<div className="w-full flex justify-center p-20">
					<SquaredLoader />
				</div>
			</MemberSettingsWrapper>
		);
	}

	return (
		<MemberSettingsWrapper page="workspace">
			<MembersPage
				columns={enhancedColumns}
				members={membersWithRoles}
				workspace={workspace}
				admins={workspace?.admins || []}
			/>
		</MemberSettingsWrapper>
	);
}
