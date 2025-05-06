import { client } from "@/lib/client";
import { useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { Ellipsis } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import type { MemberWithRole } from "./data-table";

const RemoveMemberButton = ({
	userId,
	page,
	pageId,
	membersWithRoles,
	refetch,
}: {
	userId: string;
	page: string | undefined;
	pageId: string | undefined;
	membersWithRoles: MemberWithRole[] | undefined;
	refetch: () => void;
}) => {
	const currentUser = useUserStore((state) => state.user);
	const { membership } = useOrganization();

	const { mutate: handleClick } = useMutation({
		mutationKey: ["workspace", "removeMember", pageId],
		mutationFn: async () => {
			if (!pageId) throw new Error("No pageId provided");
			if (page === "workspace") {
				await client.workspace.removeUser.$post();
				return "Workspace member removed";
			}
			await client.team.removeUser.$post({
				teamId: pageId,
			});
			return "Team member removed";
		},
		onSuccess: (data) => {
			toast.success(data);
			membersWithRoles && refetch();
		},
		onError: (error) => {
			toast.error("Member could not be removed", {
				description: parseError(error),
			});
		},
	});

	if (membership?.role !== "org:admin") {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="items-center"
					disabled={userId === currentUser?.id}
				>
					<Ellipsis className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<Button variant="ghost" onClick={() => handleClick()}>
						Remove from {page === "workspace" ? "Workspace" : "Team"}
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default RemoveMemberButton;
