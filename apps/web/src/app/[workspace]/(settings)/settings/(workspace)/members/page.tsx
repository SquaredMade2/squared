"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import { useOrganization } from "@clerk/nextjs";
import MemberSettingsWrapper from "../../MemberSettingsWrapper";

export default function WorkspaceMembersPage() {
	const { memberships, isLoaded, organization } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});
	const users = memberships?.data?.map((membership) => ({
		...membership.publicUserData,
		role: membership.role,
	}));

	const enhancedColumns = columns.map((col) => ({
		...col,
		meta: {
			page: "workspace",
			pageId: organization?.id,
			membersWithRoles: users,
		},
	}));

	if (!isLoaded) {
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
