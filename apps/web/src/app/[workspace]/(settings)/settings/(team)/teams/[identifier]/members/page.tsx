"use client";

import MemberSettingsWrapper from "@/app/[workspace]/(settings)/settings/MemberSettingsWrapper";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { MembersPage } from "@/components/Settings/Members/MembersPage";
import { columns } from "@/components/Settings/Members/columns";
import { useTeams } from "@/hooks/useTeams";
import { useOrganization } from "@clerk/nextjs";

export default function TeamMembersPage() {
	const { team, loading: teamLoading } = useTeams();
	const { memberships, isLoaded } = useOrganization({
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
			page: "team",
			pageId: team?.id,
			membersWithRoles: users,
		},
	}));

	if (teamLoading || !isLoaded) {
		return (
			<MemberSettingsWrapper page="team">
				<div className="flex w-full justify-center p-20">
					<SquaredLoader />
				</div>
			</MemberSettingsWrapper>
		);
	}

	return (
		<MemberSettingsWrapper page="team">
			<MembersPage columns={enhancedColumns} team={team} />
		</MemberSettingsWrapper>
	);
}
