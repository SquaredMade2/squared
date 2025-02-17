"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import { client } from "@/lib/client";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import MemberSettingsWrapper from "../../MemberSettingsWrapper";

export default function WorkspaceMembersPage() {
	const { organization, isLoaded } = useOrganization();

	const { data: pageUsers = [], isLoading: userLoading } = useQuery({
		queryKey: ["workspaceUsers", organization?.id],
		queryFn: async () => {
			if (!organization) return [];
			const users = await client.user.getWorkspaceUsersWithRoles
				.$get({ workspaceId: organization.id })
				.then((res) => res.json());
			return users;
		},
		enabled: !!organization,
	});

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "workspace",
			pageId: organization?.id,
			membersWithRoles: pageUsers,
		},
	}));

	if (!isLoaded || userLoading) {
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
			<MembersPage columns={enhancedColumns} members={pageUsers} />
		</MemberSettingsWrapper>
	);
}
