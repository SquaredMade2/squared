"use client";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/lib/services";
import { parseError } from "@/utils/parseError";
import { TODO } from "@squared/context";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyUserToken(): void {
	const router = useRouter();
	const { token } = useParams();
	const singleToken = Array.isArray(token) ? token[0] : token;
	const { toast } = useToast();

	useEffect(() => {
		const verifyingUser = async (): Promise<void> => {
			try {
				const user = await authService.verifyUser(TODO, { token: singleToken });
				if (!user) throw new Error("Could not find user to verify");
				toast({ title: "User Verified Successfully" });
				router.refresh();
				router.replace("/");
			} catch (error) {
				toast({
					title: parseError(error, "Could not find user to verify"),
					variant: "destructive",
				});
				throw error;
			}
		};
		verifyingUser();
	}, [token]);
}
