import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { DropdownMenuGroup } from "@squaredmade/ui/dropdown-menu";
import type { WorkspaceRole } from "@squared/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCog } from "lucide-react";
import type { MemberWithRole } from "./data-table";

const ManageMembersRoleButton = ({
	userId,
	pageId,
	membersWithRoles,
}: {
	userId: string;
	page: string | undefined;
	pageId: string | undefined;
	membersWithRoles: MemberWithRole[] | undefined;
	fetchWorkspaceUsersWithRoles: () => void;
}) => {
	const queryClient = useQueryClient();
	const loggedInUser = useUserStore((state) => state.user);
	const { toast } = useToast();
	const selectedUserRole = membersWithRoles?.find(
		(user) => user.id === userId,
	)?.role;

	const { data: loggedInUserRole, error } = useQuery({
		queryKey: ["userRole", loggedInUser?.id, pageId],
		queryFn: async () => {
			if (!loggedInUser || !pageId) throw new Error("User or Page not found");
			const response = await client.user.getUserWorkspaceRole.$get({
				workspaceId: pageId,
			});
			return response.json();
		},
		enabled: !!loggedInUser && !!pageId,
	});

	const updateRoleMutation = useMutation({
		mutationFn: async (newRole: WorkspaceRole) => {
			if (!pageId || !loggedInUser) throw new Error("Missing required data");
			return await client.user.updateUsersRole.$post({
				userId,
				workspaceId: pageId,
				newRole,
			});
		},
		onSuccess: (_, newRole) => {
			queryClient.invalidateQueries({
				queryKey: ["workspaceUsers", pageId],
			});
			queryClient.invalidateQueries({
				queryKey: ["userRole", loggedInUser?.id, pageId],
			});
			toast({ title: `Member role updated to ${newRole}` });
		},
		onError: (error) => {
			toast({
				title: "Member role could not be updated",
				description: parseError(error, "unknown error"),
				variant: "destructive",
			});
		},
	});

	const handleClick = (newRole: WorkspaceRole) => {
		updateRoleMutation.mutate(newRole);
	};

	if (
		error ||
		(loggedInUserRole?.role !== "admin" && loggedInUserRole?.role !== "owner")
	) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="items-center"
					disabled={userId === loggedInUser?.id}
				>
					<UserCog />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => handleClick("member")}
						disabled={
							selectedUserRole === "member" ||
							(loggedInUserRole.role === "admin" &&
								(selectedUserRole === "admin" || selectedUserRole === "owner"))
						}
					>
						Change user role to Member
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("admin")}
						disabled={
							selectedUserRole === "admin" ||
							(loggedInUserRole.role === "admin" &&
								selectedUserRole === "owner")
						}
					>
						Change user role to Admin
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("owner")}
						disabled={
							selectedUserRole === "owner" || loggedInUserRole.role !== "owner"
						}
					>
						Change user role to Owner
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ManageMembersRoleButton;
