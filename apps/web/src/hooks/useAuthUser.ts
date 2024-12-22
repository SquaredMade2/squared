import { logout } from "@/lib/auth";
import { userService } from "@/lib/services";
import { useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { TODO } from "@squared/context";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useAuthUser() {
	const { user, setUser } = useUserStore((state) => state);
	const { data: session, status } = useSession();

	const { data, isLoading, error } = useQuery({
		queryKey: ["authUser", session?.user?.id, status],
		queryFn: async () => {
			if (status === "authenticated" && session?.user) {
				const loggedUser = await userService.getUser(TODO, {
					userId: session.user.id,
				});
				if (loggedUser) {
					setUser(loggedUser);
					return loggedUser;
				}
				// User not found in the database
				await logout();
				return null;
			}
			if (status === "unauthenticated") {
				await logout();
				return null;
			}
			return null;
		},
		retry: false,
	});

	return {
		user: data || user,
		loading: isLoading,
		error: parseError(error, "Failed to fetch user"),
	};
}
