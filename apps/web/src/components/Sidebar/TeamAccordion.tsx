"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";
import type { Team } from "@squared/db";
import { LayoutGrid } from "@squared/icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AddTeamButton from "../Buttons/AddTeamButton";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { buttonVariants } from "../ui/button";
import NavBarTeams from "./NavBarTeams";

interface TeamAccordionProps {
	teams: Team[];
	currentTeam: Team | null;
	workspaceUrl?: string;
}

export function TeamAccordion({
	teams,
	currentTeam,
	workspaceUrl,
}: TeamAccordionProps) {
	const pathname = usePathname();
	const [openItems, setOpenItems] = useState<string[]>([]);

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

	useEffect(() => {
		if (currentTeam) {
			setOpenItems((prev) =>
				prev.includes(currentTeam.id) ? prev : [...prev, currentTeam.id],
			);
		}
	}, [currentTeam]);

	const handleAccordionChange = (value: string[]) => {
		setOpenItems(value);
	};

	return (
		<>
			<ScrollArea className="h-[calc(100vh-16rem)]">
				<Accordion
					type="multiple"
					value={openItems}
					onValueChange={handleAccordionChange}
				>
					{teams?.map((team: Team) => (
						<AccordionItem value={team.id} key={team.id} className="pb-2">
							<AccordionTrigger
								className={cn(
									buttonVariants({ variant: "ghost" }),
									"justify-between",
								)}
							>
								<div className="flex items-center gap-2">
									<LayoutGrid className="h-4 w-4 text-primary" />
									<span className="font-medium text-sm">{team.name}</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="pt-1 pl-6">
								<NavBarTeams
									teamIdentifier={team.identifier}
									currentPage={currentPage}
									active={currentTeam?.id === team.id}
								/>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
				{/* NOTE
				Add in check to show button only if user is an Admin of the workspace once Admin privileges are implemented
				isUserAdmin && <AddTeamButton />
				*/}
				<div className="ml-6">
					<AddTeamButton workspaceUrl={workspaceUrl ?? ""} />
				</div>
			</ScrollArea>
		</>
	);
}
