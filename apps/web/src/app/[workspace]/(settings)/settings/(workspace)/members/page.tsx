"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import { useUsers } from "@/hooks/useUsers";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import { useQuery } from "@tanstack/react-query";
import MemberSettingsWrapper from "../../MemberSettingsWrapper";

export default function WorkspaceMembersPage() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { loading: userLoading } = useUsers();

	const { data: pageUsers = [] } = useQuery({
		queryKey: ["workspaceUsers", workspace?.id],
		queryFn: async () => {
			if (!workspace) return [];
			return userService.getWorkspaceUsersWithRoles(TODO, {
				workspaceId: workspace.id,
			});
		},
		enabled: !!workspace,
	});

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "workspace",
			pageId: workspace?.id,
			membersWithRoles: pageUsers,
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
				members={pageUsers}
				workspace={workspace}
			/>
		</MemberSettingsWrapper>
	);
}
