"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useToast } from "@/components/ui/use-toast";
import { workspaceService } from "@/lib/services";
import { TODO } from "@squared/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TokenVerificationPage({
	params,
}: { params: { token: string } }) {
	const router = useRouter();
	const { data: session, status } = useSession();
	const { toast } = useToast();

	useEffect(() => {
		const verifyToken = async () => {
			if (status === "authenticated" && session?.user) {
				try {
					const workspace = await workspaceService.joinWorkspace(TODO, {
						token: params.token,
						userId: session.user.id,
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
			} else if (status === "unauthenticated") {
				router.push(`/login?token=${params.token}`);
			}
		};

		verifyToken();
	}, []);

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4 min-h-screen">
			<SquaredLoader />
			<p className="text-lg">Verifying invitation...</p>
		</div>
	);
}
