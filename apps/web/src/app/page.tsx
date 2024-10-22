"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/store";
import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useAuthUser } from "@/hooks/useAuthUser";

const HomePage = () => {
	const router = useRouter();
	const { user, loading, error } = useAuthUser();
	const { getWorkspace, getAllWorkspaces } = useWorkspaceStore(
		(state) => state,
	);

	useEffect(() => {
		const handleRedirection = async () => {
			if (loading) return;

			try {
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
				} else {
					router.push("/login");
				}
			} catch (error) {
				console.error("Redirection Error: ", error);
			}
		};

		handleRedirection();
	}, [user, loading, router]);

	if (loading) {
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

	if (error) {
		return <div>Error: {error}</div>;
	}

	return null;
};

export default HomePage;
