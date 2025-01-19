"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const HomePage = () => {
	const router = useRouter();

	const { isLoading: workspaceLoading, error: workspaceError } = useQuery({
		queryKey: ["defaultWorkspace"],
		queryFn: async () => {
			const res = await client.user.getDefaultWorkpace
				.$get()
				.then((res) => res.json());
			if (!res) {
				router.push("/join");
				return res;
			}
			router.push(`/${res.url}`);
			return null;
		},
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
