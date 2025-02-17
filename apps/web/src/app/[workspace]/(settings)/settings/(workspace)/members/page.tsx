"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import MemberSettingsWrapper from "../../MemberSettingsWrapper";

export default function WorkspaceMembersPage() {
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { data: pageUsers = [], isLoading: userLoading } = useQuery({
		queryKey: ["workspaceUsers", workspace?.id],
		queryFn: async () => {
			if (!workspace) return [];
			const users = await client.user.getWorkspaceUsersWithRoles
				.$get({ workspaceId: workspace.externalId })
				.then((res) => res.json());
			return users;
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
				<div className="flex w-full justify-center p-20">
					<SquaredLoader />
				</div>
			</MemberSettingsWrapper>
		);
	}

	return (
		<MemberSettingsWrapper page="workspace">
			<MembersPage columns={enhancedColumns} />
		</MemberSettingsWrapper>
	);
}
