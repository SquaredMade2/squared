import { useOrganization, useUser } from "@clerk/nextjs";
import { useMemo } from "react";

export function useUsers() {
	const { user, isLoaded: userLoaded } = useUser();
	const { memberships, isLoaded: orgLoaded } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});

	// Memoize the users array to prevent regenerating it on every render
	const users = useMemo(
		() =>
			memberships?.data?.map((membership) => membership.publicUserData) || [],
		[memberships?.data],
	);

	// Memoize loading state
	const loading = useMemo(
		() => !userLoaded || !orgLoaded,
		[userLoaded, orgLoaded],
	);

	// Return memoized result
	return useMemo(
		() => ({
			user,
			users,
			loading,
		}),
		[user, users, loading],
	);
}
