"use client";

import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";
import { useTeamStore } from "@/store";

export default function TeamSelector() {
	const { team, setTeam, teams } = useTeamStore((state) => state);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="gap-2" size="sm" variant="outline">
					<LayoutGrid className="h-4 w-4 text-[#9577FF]" />
					<span className="truncate">{team?.identifier}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{teams.map((t) => (
					<DropdownMenuItem
						className="truncate"
						key={t.id}
						onClick={() => setTeam(t)}
					>
						{t.identifier}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
