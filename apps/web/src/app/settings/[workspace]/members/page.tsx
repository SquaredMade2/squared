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
	const { loading: userLoading } = useUsers();
	const [pageUsers, setPageUsers] = useState<MemberWithRole[]>([]);

	const fetchWorkspaceUsersWithRoles = async () => {
		if (!workspace) return;
		const users = await userService.getWorkspaceUsersWithRoles(TODO, {
			workspaceId: workspace?.id,
		});
		setPageUsers(users);
	};

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "workspace",
			pageId: workspace?.id,
			setPageUsers,
			membersWithRoles: pageUsers,
			fetchWorkspaceUsersWithRoles: fetchWorkspaceUsersWithRoles,
		},
	}));

	useEffect(() => {
		fetchWorkspaceUsersWithRoles();
	}, [workspace]);

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
				members={pageUsers}
				workspace={workspace}
			/>
		</MemberSettingsWrapper>
	);
}
