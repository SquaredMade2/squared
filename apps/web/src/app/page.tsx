"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const HomePage = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const { signOut } = useClerk();

	const { isLoading: workspaceLoading, error: workspaceError } = useQuery({
		queryKey: ["user", "defaultWorkspace"],
		queryFn: async () => {
			if (isLoaded && !user) await signOut();
			const res = await client.user.getDefaultWorkpace
				.$get()
				.then((res) => res.json());
			if (!res || res.url === "undefined") {
				router.push("/join");
				return res;
			}
			router.push(`/${res.url}`);
			return null;
		},
		enabled: isLoaded && !!user,
	});

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

	return null;
};

export default HomePage;
