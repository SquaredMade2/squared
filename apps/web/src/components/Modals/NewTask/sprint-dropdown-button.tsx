"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import type { Sprint } from "@squaredmade/db";
import { Activity, Check } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useMemo } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useModalStore } from "@/store";

export const SprintDropdownButton = ({
	activeSprint,
	upcomingSprints,
}: {
	activeSprint: Sprint | null;
	upcomingSprints: Sprint[];
}) => {
	const { newTaskData, setNewTaskData } = useModalStore((state) => state);

	const handleSelectSprint = (sprint: Sprint | null) => {
		const isSameSprint = selectedSprint?.id === sprint?.id;
		const newSprint = isSameSprint ? null : sprint;

		setNewTaskData({ ...newTaskData, sprintId: newSprint?.id ?? null });
	};

	const selectedSprint = useMemo(() => {
		if (!newTaskData.sprintId) return null;
		if (activeSprint?.id === newTaskData.sprintId) return activeSprint;
		return upcomingSprints.find((s) => s.id === newTaskData.sprintId) || null;
	}, [newTaskData.sprintId, activeSprint, upcomingSprints]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className={cn("w-full max-w-full")} variant="outline">
					<span className="cursor-pointer">
						<Activity className="mr-2 size-4 text-muted-foreground" />
					</span>
					{selectedSprint?.name || <span>Select Sprint</span>}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-full p-0" side="left">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>No sprints found.</CommandEmpty>
							{activeSprint && (
								<CommandGroup>
									<p className="font-bold text-muted-foreground text-xs">
										Active
									</p>

									<CommandItem
										onSelect={() => handleSelectSprint(activeSprint)}
										value={activeSprint.name}
									>
										{activeSprint.name}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												newTaskData.sprintId === activeSprint.id
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								</CommandGroup>
							)}

							<CommandGroup>
								<p className="font-bold text-muted-foreground text-xs">
									Upcoming
								</p>
								{upcomingSprints.map((item: Sprint) => (
									<CommandItem
										key={item.id}
										onSelect={() => handleSelectSprint(item)}
										value={item.name}
									>
										{item.name}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												newTaskData.sprintId === item.id
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
