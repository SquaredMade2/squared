import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { userService } from "@/lib/services";
import { useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { DropdownMenuGroup } from "@repo/ui/dropdown-menu";
import { TODO } from "@squared/context";
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

	const { data: loggedInUserRole } = useQuery({
		queryKey: ["userRole", loggedInUser?.id, pageId],
		queryFn: async () => {
			if (!loggedInUser || !pageId) return null;
			return userService.getUserWorkspaceRole(TODO, {
				userId: loggedInUser.id,
				workspaceId: pageId,
			});
		},
		enabled: !!loggedInUser && !!pageId,
	});

	const updateRoleMutation = useMutation({
		mutationFn: async (newRole: WorkspaceRole) => {
			if (!pageId || !loggedInUser) throw new Error("Missing required data");
			return userService.updateUsersRole(TODO, {
				callerId: loggedInUser.id,
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

	if (loggedInUserRole !== "admin" && loggedInUserRole !== "owner") {
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
							(loggedInUserRole === "admin" &&
								(selectedUserRole === "admin" || selectedUserRole === "owner"))
						}
					>
						Change user role to Member
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("admin")}
						disabled={
							selectedUserRole === "admin" ||
							(loggedInUserRole === "admin" && selectedUserRole === "owner")
						}
					>
						Change user role to Admin
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleClick("owner")}
						disabled={
							selectedUserRole === "owner" || loggedInUserRole !== "owner"
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
