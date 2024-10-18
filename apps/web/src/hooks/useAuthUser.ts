import { useEffect, useState } from "react";
import { useAuthStore, useUserStore } from "@/store";
import { useSession } from "next-auth/react";
import type { User } from "next-auth";
import { useToast } from "@/components/ui/use-toast";

export function useAuthUser() {
	const { logout, setUser, user } = useAuthStore((state) => state);
	const { getUser } = useUserStore((state) => state);
	const { data, status } = useSession();
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const handleGetUser = async (authUser: User) => {
			try {
				if (authUser) {
					const { user: loggedUser } = await getUser(authUser.id);
					if (loggedUser) {
						setUser(loggedUser);
					}
				} else if (status === "unauthenticated") {
					await logout();
				}
				setLoading(false);
			} catch (error) {
				console.error("Redirection Error: ", error);
				toast({
					title: "An error occurred",
					description:
						error instanceof Error ? error.message : "An error occurred",
				});
			}
		};
		if (data?.user) {
			handleGetUser(data.user);
		}
	}, [status]);

	return {
		user,
		loading,
	};
}
