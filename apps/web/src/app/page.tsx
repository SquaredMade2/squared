"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { Loader2 } from "lucide-react";
import type { User } from "@repo/db";

const HomePage = () => {
	const router = useRouter();
	const { user, logout } = useAuthStore((state) => state);
	const { getWorkspace, getAllWorkspaces } = useWorkspaceStore(
		(state) => state,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const handleRedirection = async (loggedUser: User) => {
			try {
				if (loggedUser) {
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
					router.push("/join");
					return;
				}

				// If no loggedUser and no cookie, redirect to login
				await logout();
				router.push("/login");
			} catch (error) {
				console.error("Redirection Error: ", error);
				// Optionally set an error state here to show an error message
			} finally {
				setLoading(false); // Stop loading once redirection is handled
			}
		};

		if (user) {
			handleRedirection(user);
		}
	}, [user, router, loading]);

	return (
		<div className="h-screen w-full">
			<div className="flex h-full justify-center items-center">
				<div className="flex flex-col gap-4 items-center">
					<div className="font-bold text-3xl">Loading...</div>
					<Loader2 size={64} className="animate-spin" />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
