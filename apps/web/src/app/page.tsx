"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useAuth, useClerk, useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HomePage = () => {
	const router = useRouter();
	const { user } = useUser();
	const { organization } = useClerk();
	const { setActive, isLoaded, userMemberships } = useOrganizationList({
		userMemberships: true,
	});
	const [error, setError] = useState<string | null>(null);
	const { orgId } = useAuth();

	useEffect(() => {
		if (!isLoaded) return;
		if (isLoaded && !organization) {
			setError(
				"There was an error loading the organization list. Please try again.",
			);
			return;
		}
		if (!user) {
			router.push("/sign-in");
		}

		if (userMemberships.data.length > 0 && !orgId && isLoaded) {
			setActive?.({
				organization: userMemberships.data[0].organization.id,
			}).then(() => {
				router.push(`/${userMemberships.data[0].organization.slug}`);
			});
		}

		if (organization && isLoaded) {
			router.push(`/${organization.slug}`);
		} else {
			router.push("/create");
		}
		//check for if the user has organizations but doesn't have an active organization set
	}, [isLoaded]);

	if (!isLoaded) {
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
		return <div>Error: {error}</div>;
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
