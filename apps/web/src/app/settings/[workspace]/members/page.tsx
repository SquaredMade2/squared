"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import type { MemberWithRole } from "@/components/Settings/Members/data-table";
import { useUsers } from "@/hooks/useUsers";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import { useEffect, useState } from "react";
import MemberSettingsWrapper from "../../MemberSettingsWrapper";

export default function WorkspaceMembersPage() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { users, loading: userLoading } = useUsers();
	const [pageUsers, setPageUsers] = useState<MemberWithRole[]>(users);

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "workspace",
			pageId: workspace?.id,
			pageUsers,
			setPageUsers,
		},
	}));

	const fetchTeamUsers = async () => {
		if (!workspace) return;
		const users = await userService.getWorkspaceUsersWithRoles(TODO, {
			workspaceId: workspace?.id,
		});
		console.log("users", users);
		setPageUsers(users);
	};

	useEffect(() => {
		fetchTeamUsers();
	}, []);

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
			<button
				onClick={fetchTeamUsers}
				className="p-2 border rounded"
				type="button"
			>
				FETCH TEAM USERS
			</button>
			<MembersPage
				columns={enhancedColumns}
				members={pageUsers}
				workspace={workspace}
				admins={workspace?.admins || []}
			/>
		</MemberSettingsWrapper>
	);
}
