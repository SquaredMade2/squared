"use client";
import { useToast } from "@/components/ui/use-toast";
import { userService } from "@/lib/services";
import { TODO } from "@squared/context";
import { useState } from "react";

export interface UpdateSubTeamDropdownProps {
	userId: string;
	name: string;
	subTeam: string | null;
}

const UpdateSubTeamDropdown = ({
	userId,
	name,
	subTeam,
}: UpdateSubTeamDropdownProps) => {
	const { toast } = useToast();
	const [subteam, setSubteam] = useState(subTeam || "default");

	const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSubteam = e.target.value;

		try {
			await userService.updateUser(TODO, {
				name: name,
				userId: userId,
				subTeam: newSubteam,
			});
			setSubteam(newSubteam);
		} catch {
			toast({
				title: "Error updating subteam",
				variant: "destructive",
			});
		}
	};

	return (
		<div>
			<select value={subteam} onChange={handleChange} name="" id="">
				<option value="default">Assigned Subteam</option>
				<option value="1">Admin</option>
				<option value="2">Member</option>
			</select>
		</div>
	);
};

export default UpdateSubTeamDropdown;
