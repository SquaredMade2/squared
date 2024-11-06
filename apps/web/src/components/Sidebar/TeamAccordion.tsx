"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { Team } from "@squared/db";
import { LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";
import NavBarTeams from "./NavBarTeams";

interface TeamAccordionProps {
	teams: Team[];
	currentTeam: Team | null;
}

export function TeamAccordion({ teams, currentTeam }: TeamAccordionProps) {
	const pathname = usePathname();

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

	return (
		<Accordion
			type="single"
			collapsible
			defaultValue={currentTeam?.id}
			className="px-2"
		>
			{teams?.map((team: Team) => (
				<AccordionItem key={team.id} value={team.id}>
					<AccordionTrigger className="text-sm py-2">
						<div className="flex items-center gap-2">
							<LayoutGrid className="text-[#9577FF] h-4 w-4" />
							{team.name}
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<NavBarTeams
							teamIdentifier={team.identifier}
							currentPage={currentPage}
							active={currentTeam?.id === team.id}
						/>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
