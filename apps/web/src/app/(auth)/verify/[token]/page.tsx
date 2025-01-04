"use client";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyUserToken() {
	const router = useRouter();
	const { token } = useParams();
	const singleToken = Array.isArray(token) ? token[0] : token;
	const { toast } = useToast();

	const verifyUserMutation = useMutation({
		mutationFn: async (token: string) => {
			const res = await client.authentication.verifyUser.$post({ token });
			return res.json();
		},
		onSuccess: () => {
			toast({ title: "User Verified Successfully" });
			router.refresh();
			router.replace("/");
		},
		onError: (error) => {
			toast({
				title: parseError(error, "Could not find user to verify"),
				variant: "destructive",
			});
			throw error;
		},
	});

	useEffect(() => {
		if (singleToken) {
			verifyUserMutation.mutate(singleToken);
		}
	}, [singleToken]);

	return null; // This component doesn't render anything
}
