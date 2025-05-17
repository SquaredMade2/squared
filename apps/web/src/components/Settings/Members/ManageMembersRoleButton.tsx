import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { useUser } from "@clerk/nextjs";
import { UserCog } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { DropdownMenuGroup } from "@squaredmade/ui/dropdown-menu";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ManageMembersRoleButton = ({
	userId,
	pageId,
}: {
	userId: string;
	pageId: string | undefined;
}) => {
	const queryClient = useQueryClient();
	const { user } = useUser();

	const updateRoleMutation = useMutation({
		mutationFn: async (newRole: ClerkAuthorization["role"]) => {
			if (!pageId) throw new Error("Missing required data");
			return await client.workspace.updateUserRole.$post({
				role: newRole,
			});
		},
		onSuccess: (_, newRole) => {
			queryClient.invalidateQueries({
				queryKey: ["workspaceUsers", pageId],
			});
			queryClient.invalidateQueries({
				queryKey: ["userRole", user?.id, pageId],
			});
			toast.success(`Member role updated to ${newRole}`);
		},
		onError: (error) => {
			toast.error("Member role could not be updated", {
				description: parseError(error, "unknown error"),
			});
		},
	});

	const handleClick = (newRole: ClerkAuthorization["role"]) => {
		updateRoleMutation.mutate(newRole);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="items-center"
					disabled={userId === user?.id}
				>
					<UserCog />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => handleClick("org:member")}>
						Change user role to Member
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleClick("org:admin")}>
						Change user role to Admin
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ManageMembersRoleButton;
