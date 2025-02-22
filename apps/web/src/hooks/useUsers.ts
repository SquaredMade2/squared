import { useOrganization, useUser } from "@clerk/nextjs";

export function useUsers() {
	const { user, isLoaded: userLoaded } = useUser();
	const { memberships, isLoaded: orgLoaded } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});
	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
	);

	return { user, users, loading: !userLoaded || !orgLoaded };
}
