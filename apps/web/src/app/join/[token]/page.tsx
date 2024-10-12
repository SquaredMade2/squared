"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore, useUserStore, useWorkspaceStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import SquaredLoader from "@/components/Loaders/SquaredLoader";

export default function TokenVerificationPage({
	params,
}: { params: { token: string } }) {
	const router = useRouter();
	const { setUser } = useAuthStore((state) => state);
	const { getUser } = useUserStore((state) => state);
	const { data: session, status } = useSession();
	const { joinWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();
	const [isVerifying, setIsVerifying] = useState(true);

	useEffect(() => {
		const verifyToken = async () => {
			if (status === "authenticated" && session?.user) {
				try {
					const { workspace } = await joinWorkspace(
						params.token,
						session.user.id,
					);
					if (workspace) {
						const { user } = await getUser(session.user.id);
						setUser(user);
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
			setIsVerifying(false);
		};

		verifyToken();
	}, [status, session, params.token, joinWorkspace, router, toast]);

	if (isVerifying) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<SquaredLoader />
				<span className="ml-2">Verifying invitation...</span>
			</div>
		);
	}

	return null;
}
