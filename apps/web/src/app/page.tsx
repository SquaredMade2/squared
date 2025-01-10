"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const HomePage = () => {
	const router = useRouter();
	const { user, isLoaded } = useUser();

	const { isLoading: workspaceLoading, error: workspaceError } = useQuery({
		queryKey: ["defaultWorkspace", user?.id],
		queryFn: async () => {
			if (user) {
				const res = await client.user.getDefaultWorkpace
					.$get({ userId: user.id })
					.then((res) => res.json());
				if (!res) {
					router.push("/join");
					return;
				}
				router.push(`/${res.url}`);
			} else {
				router.push("/sign-in");
			}
		},
		enabled: !!user || isLoaded,
	});

	if (workspaceLoading) {
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

	if (workspaceError) {
		return <div>Error: {workspaceError?.message}</div>;
	}

	return null;
};

export default HomePage;
