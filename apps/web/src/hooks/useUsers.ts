import { useOrganization, useUser } from "@clerk/nextjs";
import type { PublicUserData } from "@clerk/types";

export function useUsers() {
	const { user, isLoaded: userLoaded } = useUser();
	const { memberships, isLoaded: orgLoaded } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});
	const users: PublicUserData[] =
		memberships?.data
			?.map((membership) => membership.publicUserData)
			.filter((user): user is PublicUserData => Boolean(user)) ?? [];

	return { user, users, loading: !(userLoaded && orgLoaded) };
}
