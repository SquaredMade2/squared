"use client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/storeZ/provider";

export default function VerifyUserToken(): void {
	const router = useRouter();
	const { token } = useParams();
	const singleToken = Array.isArray(token) ? token[0] : token;
	const { toast } = useToast();
	const { verifyUser } = useAuthStore().getState();

	useEffect(() => {
		const verifyingUser = async (): Promise<void> => {
			try {
				const data = await verifyUser(singleToken);
				if (!data) throw new Error("Could not find user to verify");
				const { message, variant, user } = data;
				toast({ title: message, variant });
				console.log("Variant:", variant);
				if (variant === "default" && user) {
					router.push("/join");
				}
			} catch (error) {
				console.error(error);
				toast({
					title: "Could not find user to verify",
					variant: "destructive",
				});
				throw error;
			}
		};
		verifyingUser();
	}, [token]);
}
