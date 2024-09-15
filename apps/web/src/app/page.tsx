"use client";
import { useEffect } from "react";
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

	useEffect(() => {
		const handleRedirection = async () => {
			const cookies = parseCookies();
			const authCookie = cookies["auth-store"];
			if (authCookie && !user) {
				destroyCookie(undefined, "auth-store");
				await logout();
				router.push("/login");
				return;
			}

			if (user) {
				// If user is logged in, redirect to the correct workspace
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
				} else {
					router.push("/join");
				}
			} else {
				await logout();
				router.push("/login");
			}
		};

		handleRedirection();
	}, [user, router, getWorkspace, getAllWorkspaces, logout]);

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
