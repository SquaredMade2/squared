"use client";

import { useTeamStore } from "@/store";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";

export default function TeamSelector() {
	const { team, setTeam, teams } = useTeamStore((state) => state);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<LayoutGrid className="h-4 w-4 text-[#9577FF]" />
					<span className="truncate">{team?.identifier}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{teams.map((team) => (
					<DropdownMenuItem
						key={team.id}
						onClick={() => setTeam(team)}
						className="truncate"
					>
						{team.identifier}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
