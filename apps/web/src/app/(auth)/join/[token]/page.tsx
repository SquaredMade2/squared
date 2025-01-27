"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useToast } from "@/components/ui/use-toast";
import { workspaceService } from "@/lib/services";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef } from "react";

export default function TokenVerificationPage(props: {
	params: Promise<{ token: string }>;
}) {
	const params = use(props.params);
	const router = useRouter();
	const { isLoaded, isSignedIn, user } = useUser();
	const { toast } = useToast();
	const hasRunRef = useRef(false);

	useEffect(() => {
		if (!isLoaded) return;
		if (!isSignedIn) {
			return router.push(`/sign-in?token=${params.token}`);
		}
		const verifyToken = async () => {
			if (user) {
				try {
					const workspace = await workspaceService.joinWorkspace(TODO, {
						token: params.token,
						userId: user.id,
					});
					if (workspace) {
						toast({
							title: "Joining Workspace",
							variant: "default",
						});
						router.push(`/${workspace.url}`);
					} else {
						router.push("/");
					}
				} catch (error) {
					console.error("Token verification error:", error);
					toast({
						title: "Failed to verify invitation token",
						variant: "destructive",
					});
					router.push("/");
				}
			}
		};

		if (!hasRunRef.current) {
			verifyToken();
			hasRunRef.current = true;
		}
	}, [isLoaded, isSignedIn]);

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4 min-h-screen">
			<SquaredLoader />
			<p className="text-lg">Verifying invitation...</p>
		</div>
	);
}
