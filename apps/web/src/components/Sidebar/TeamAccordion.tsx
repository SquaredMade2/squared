"use client";

import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Team } from "@squared/db";
import { ChevronDown, ChevronUp, LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavBarTeams from "./NavBarTeams";

interface TeamAccordionProps {
	teams: Team[];
	currentTeam: Team | null;
}

export function TeamAccordion({ teams, currentTeam }: TeamAccordionProps) {
	const pathname = usePathname();
	const [openTeams, setOpenTeams] = useState<string[]>([currentTeam?.id || ""]);

	const getCurrentPage = (path: string) => {
		if (path.endsWith("/all")) return "all";
		if (path.endsWith("/active")) return "active";
		if (path.endsWith("/backlog")) return "backlog";
		if (path.includes("/views")) return "views";
		if (path.endsWith("/current")) return "current";
		if (path.includes("/sprints")) return "sprints";
		if (path.includes("/upcoming")) return "upcoming";
		return "";
	};

	const currentPage = getCurrentPage(pathname);

	const toggleTeam = (teamId: string) => {
		setOpenTeams((prev) =>
			prev.includes(teamId)
				? prev.filter((id) => id !== teamId)
				: [...prev, teamId],
		);
	};

	return (
		<ScrollArea className="h-[calc(100vh-16rem)]">
			<div className="space-y-2 py-2">
				{teams?.map((team: Team) => (
					<Collapsible
						key={team.id}
						open={openTeams.includes(team.id)}
						onOpenChange={() => toggleTeam(team.id)}
					>
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								className="w-full justify-between"
								size="sm"
							>
								<div className="flex items-center gap-2">
									<LayoutGrid className="text-primary h-4 w-4" />
									<span className="text-sm font-medium">{team.name}</span>
								</div>
								{openTeams.includes(team.id) ? (
									<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
								) : (
									<ChevronUp className="h-4 w-4 shrink-0 transition-transform duration-200" />
								)}
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="pl-6 pt-1">
							<NavBarTeams
								teamIdentifier={team.identifier}
								currentPage={currentPage}
								active={currentTeam?.id === team.id}
							/>
						</CollapsibleContent>
					</Collapsible>
				))}
			</div>
		</ScrollArea>
	);
}
