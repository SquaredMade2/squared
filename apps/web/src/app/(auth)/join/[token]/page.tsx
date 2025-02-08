"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import { useToast } from "@/components/ui/use-toast";
import { workspaceService } from "@/lib/services";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef } from "react";

// export const metadata = {
// 	openGraph: {
// 		title: "Squared",
// 		description: "You've been invited to join Squared!",
// 		siteName: "Sqaured",
// 		images: [
// 			{
// 				url: "/logo.png",
// 				width: 800,
// 				height: 600,
// 				alt: "Squared Logo",
// 			},
// 			{
// 				url: "/logo.png",
// 				width: 1800,
// 				height: 1600,
// 				alt: "Squared Logo",
// 			},
// 		],
// 		locale: "en_US",
// 		type: "website",
// 	},
// 	twitter: {
// 		card: "summary_large_image",
// 		title: "Squred",
// 		description: "You've been invited to join Squared!",
// 		images: ["/logo.png"],
// 	},
// };

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
		<div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
			<SquaredLoader />
			<p className="text-lg">Verifying invitation...</p>
		</div>
	);
}
