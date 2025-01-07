"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { workspaceService } from "@/lib/services";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
	const router = useRouter();
	const { isLoaded, userId } = useAuth();

	const {
		data: workspaces,
		isLoading: workspacesLoading,
		error: workspacesError,
	} = useQuery({
		queryKey: ["workspaces", userId],
		queryFn: () => workspaceService.getUserWorkspaces(userId),
		enabled: !!userId,
	});

	const {
		data: defaultWorkspace,
		isLoading: defaultWorkspaceLoading,
		error: defaultWorkspaceError,
	} = useQuery({
		queryKey: ["defaultWorkspace", userId],
		queryFn: () => workspaceService.getDefaultWorkspace(userId),
		enabled: !!userId,
	});

	useEffect(() => {
		const handleRedirection = async () => {
			if (!isLoaded) return;

			try {
				if (userId) {
					if (defaultWorkspace?.url) {
						router.push(`/${defaultWorkspace.url}`);
						return;
					}

					if (workspaces?.length) {
						router.push(`/${workspaces[0].url}`);
						return;
					}

					router.push("/join");
				} else {
					router.push("/sign-in");
				}
			} catch (error) {
				console.error("Redirection Error: ", error);
			}
		};

		handleRedirection();
	}, [isLoaded, userId, defaultWorkspace, workspaces, router]);

	if (!isLoaded || workspacesLoading || defaultWorkspaceLoading) {
		return (
			<div className="h-screen w-full">
				<div className="flex h-full justify-center items-center">
					<div className="flex flex-col gap-4 items-center">
						<div className="font-bold text-3xl">Loading</div>
						<SquaredLoader />
					</div>
				</div>
			</div>
		);
	}

	if (workspacesError || defaultWorkspaceError) {
		return (
			<div>Error: {(workspacesError || defaultWorkspaceError)?.message}</div>
		);
	}

	return null;
};

export default HomePage;
