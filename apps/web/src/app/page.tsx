"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { Loader2 } from "lucide-react";
import { parseCookies, destroyCookie } from "nookies";

const HomePage = () => {
	const router = useRouter();
	const { user, logout } = useAuthStore((state) => state);
	const { getWorkspace, getAllWorkspaces } = useWorkspaceStore(
		(state) => state,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const handleRedirection = async () => {
			try {
				const cookies = parseCookies();
				const authCookie = cookies["auth-store"];

				// If there is a cookie but no user, log out and redirect
				if (authCookie && !user) {
					destroyCookie(undefined, "auth-store");
					await logout();
					router.push("/login");
					return;
				}

				// If there is a user, redirect to appropriate workspace or join page
				if (user) {
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
					router.push("/join");
					return;
				}

				// If no user and no cookie, redirect to login
				if (!authCookie && !user) {
					await logout();
					router.push("/login");
				}
			} catch (error) {
				console.error("Redirection Error: ", error);
				// Optionally set an error state here to show an error message
			} finally {
				setLoading(false); // Stop loading once redirection is handled
			}
		};

		if (loading) {
			handleRedirection();
		}
	}, [user, router, getWorkspace, getAllWorkspaces, logout, loading]);

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
