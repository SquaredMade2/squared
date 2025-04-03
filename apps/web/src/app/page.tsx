"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useClerk, useOrganizationList, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const HomePage = () => {
	const router = useRouter();
	const { user, isLoaded: userLoaded } = useUser();
	const { organization, signOut } = useClerk();
	const {
		setActive,
		isLoaded: orgLoaded,
		userMemberships,
	} = useOrganizationList({
		userMemberships: true,
	});

	const { error, isLoading } = useQuery({
		queryKey: ["user", "defaultWorkspace"],
		queryFn: async () => {
			if (!user) {
				await signOut();
				router.push("/sign-in");
				return null;
			}
			if (organization) {
				router.push(`/${organization.slug}`);
				return organization.slug;
			}
			if (userMemberships.data && userMemberships.data.length > 0) {
				setActive?.({
					organization: userMemberships.data[0].organization.id,
				});
				router.push(`/${userMemberships.data[0].organization.slug}`);
				return userMemberships.data[0].organization.slug;
			}
			router.push("/create");
			return null;
		},
		enabled: userLoaded && orgLoaded,
	});

	if (isLoading) {
		return (
			<div className="h-screen w-full">
				<div className="flex h-full items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="font-bold text-3xl">Loading</div>
						<SquaredLoader />
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	// Fallback UI instead of returning null
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="font-bold text-xl">Preparing your workspace...</div>
				<SquaredLoader />
			</div>
		</div>
	);
};

export default HomePage;
