"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore, useWorkspaceStore } from "@/store";
import { useSession } from "next-auth/react";
import type { User } from "next-auth";
import SquaredLoader from "@/components/Loaders/SquaredLoader";

const HomePage = () => {
	const router = useRouter();
	const { logout, setUser } = useAuthStore((state) => state);
	const { getUser } = useUserStore((state) => state);
	const { data, status } = useSession();
	const { getWorkspace, getAllWorkspaces } = useWorkspaceStore(
		(state) => state,
	);

	useEffect(() => {
		const handleRedirection = async (authUser: User) => {
			try {
				if (authUser) {
					const { user: loggedUser } = await getUser(authUser.id);
					if (loggedUser) {
						setUser(loggedUser);
						// If there is a loggedUser, redirect to appropriate workspace or join page
						if (loggedUser.defaultWorkspaceId) {
							const { workspace } = await getWorkspace(
								loggedUser.defaultWorkspaceId,
							);
							if (workspace?.url) {
								router.push(`/${workspace.url}`);
								return;
							}
						}

						const workspaces = await getAllWorkspaces(loggedUser.id);
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
		if (data?.user) {
			handleRedirection(data.user);
		}
	}, [router, status]);

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
