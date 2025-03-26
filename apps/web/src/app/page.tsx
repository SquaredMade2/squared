"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { useClerk, useOrganizationList, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const { setActive } = useOrganizationList();
	const { signOut, organization } = useClerk();

	const {
		data: workspace,
		isLoading: workspaceLoading,
		error: workspaceError,
	} = useQuery({
		queryKey: ["user", "defaultWorkspace"],
		queryFn: async () => {
			if (isLoaded && !user) {
				await signOut();
				return null;
			}

			const res = await client.user.getDefaultWorkpace
				.$get()
				.then((res) => res.json());

			setActive && res?.externalId
				? setActive({ organization: res.externalId })
				: "";

			return res;
		},
		enabled: isLoaded && !!user,
	});

	// Handle navigation effects outside of the query function
	useEffect(() => {
		if (!workspaceLoading && organization) {
			router.push(`/${organization.slug}`);
			return;
		}
		if (!workspaceLoading && workspace) {
			if (!workspace || !workspace.url || workspace.url === "undefined") {
				router.push("/create");
			} else {
				// Set the active organization first if needed
				if (workspace.externalId && organization) {
					setActive?.({ organization: workspace.externalId }).then(() => {
						router.push(`/${workspace.url}`);
					});
				} else {
					router.push(`/${workspace.url}`);
				}
			}
		}
	}, [workspace, workspaceLoading, router, organization]);

	if (workspaceLoading) {
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
		return <div>Error: {workspaceError?.message}</div>;
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
