import { useToast } from "@/components/ui/use-toast";
import { logout } from "@/lib/auth";
import { useUserStore } from "@/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuthUser() {
	const { getUser, user, setUser } = useUserStore((state) => state);
	const { data: session, status } = useSession();
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleGetUser = async () => {
			setLoading(true);
			setError(null);

			try {
				if (status === "authenticated" && session?.user) {
					const { user: loggedUser } = await getUser(session.user.id);
					if (loggedUser) {
						setUser(loggedUser);
					} else {
						// User not found in the database
						await logout();
					}
				} else if (status === "unauthenticated") {
					await logout();
				}
			} catch (error) {
				console.error("Auth Error: ", error);
				setError(error instanceof Error ? error.message : "An error occurred");
				toast({
					title: "An error occurred",
					description:
						error instanceof Error ? error.message : "An error occurred",
				});
			} finally {
				setLoading(false);
			}
		};

		handleGetUser();
	}, [status]);

	return {
		user,
		loading,
		error,
	};
}
