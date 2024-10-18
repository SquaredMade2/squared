"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useWorkspaceStore } from "@/store";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useAuthUser } from "@/hooks/useAuthUser";
import type { User } from "@repo/db";

const HomePage = () => {
	const router = useRouter();
	const { logout } = useAuthStore((state) => state);
	const { user } = useAuthUser();
	const { getWorkspace, getAllWorkspaces } = useWorkspaceStore(
		(state) => state,
	);

	useEffect(() => {
		const handleRedirection = async (authUser: User | null) => {
			try {
				if (authUser) {
					if (user) {
						// If there is a loggedUser, redirect to appropriate workspace or join page
						if (user.defaultWorkspaceId) {
							const { workspace } = await getWorkspace(user.defaultWorkspaceId);
							if (workspace?.url) {
								router.push(`/${workspace.url}`);
								return;
							}
						}

						const workspaces = await getAllWorkspaces(user.id);
						if (workspaces.length) {
							router.push(`/${workspaces[0].url}`);
							return;
						}
					}
					router.push("/join");
					return;
				}

				// If no loggedUser and no cookie, redirect to login
				await logout();
				router.push("/login");
			} catch (error) {
				console.error("Redirection Error: ", error);
				// Optionally set an error state here to show an error message
			}
		};
		handleRedirection(user);
	}, [router]);

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
};

export default HomePage;
