"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useClerk, useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

	useEffect(() => {
		const handleRedirect = async () => {
			if (!userLoaded || !orgLoaded) {
				// Wait for both user and organization data to be loaded
				return;
			}

			if (!user) {
				await signOut();
				router.push("/sign-in");
				return;
			}

			if (organization) {
				router.push(`/${organization.slug}`);
				return;
			}

			if (userMemberships.data && userMemberships.data.length > 0) {
				setActive?.({
					organization: userMemberships.data[0].organization.id,
				});
				router.push(`/${userMemberships.data[0].organization.slug}`);
				return;
			}

			// If no organization or membership, direct to create workspace
			router.push("/create");
		};

		handleRedirect();
	}, [
		userLoaded,
		orgLoaded,
		user,
		organization,
		userMemberships,
		router,
		signOut,
		setActive,
	]);

	// Show a loader while the data is loading and the redirect is being determined
	if (!userLoaded || !orgLoaded) {
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

	// Fallback UI or a brief loading message after data is loaded but before redirect
	// This will typically be very brief as the useEffect will trigger the redirect
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
