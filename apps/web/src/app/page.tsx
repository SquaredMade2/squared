"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useAuth, useClerk, useOrganizationList, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
	const router = useRouter();
	const { user } = useUser();
	const { organization, signOut } = useClerk();
	const { setActive, isLoaded, userMemberships } = useOrganizationList({
		userMemberships: true,
	});
	const { orgId } = useAuth();

	const {
		data: workspace,
		isLoading: workspaceLoading,
		error: workspaceError,
	} = useQuery({
		queryKey: ["user", "defaultWorkspace"],
		queryFn: async () => {
			if (!user) {
				await signOut();
			}
			if (isLoaded && userMemberships.data.length > 0 && !orgId) {
				setActive?.({
					organization: userMemberships.data[0].organization.id,
				});
				return userMemberships.data[0].organization.slug;
			}
		},
		enabled: isLoaded && !!user && userMemberships.data.length > 0 && !orgId,
	});

	useEffect(() => {
		if (!isLoaded) return;
		if (!workspaceLoading && workspace) {
			router.push(`/${workspace}`);
		}
		if (organization && isLoaded) {
			router.push(`/${organization.slug}`);
		} else {
			router.push("/create");
		}
	}, [isLoaded, workspace, workspaceLoading]);

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

	if (workspaceError) {
		return <div>Error: {workspaceError.message}</div>;
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
