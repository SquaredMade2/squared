"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const HomePage = async () => {
	const router = useRouter();
	const { userId } = await auth();

	const { isLoading: workspaceLoading, error: workspaceError } = useQuery({
		queryKey: ["defaultWorkspace", userId],
		queryFn: async () => {
			if (userId) {
				const res = await client.user.getDefaultWorkpace
					.$get({ userId })
					.then((res) => res.json());
				router.push(`/${res.url}`);
			}
		},
		enabled: !!userId,
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
