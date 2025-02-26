"use client";

import { high, low, medium } from "@/components/Svg";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { effortEstimateOptions } from "@/lib/constants";
import { useEventStore, useTaskStore, useTeamStore } from "@/store";
import type { TaskEvent } from "@squared/db";
import { ChevronDown } from "@squared/icons";
import { useMutation } from "@tanstack/react-query";
import { type JSX, useState } from "react";

const EffortEstimateDropdown = () => {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	const { team } = useTeamStore((state) => state);
	const { currentTask, setCurrentTask } = useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);

	if (!currentTask) return null;

	const { id: taskId } = currentTask;

	const sidebarEffortEstimate = ():
		| { text: string; value: number }
		| undefined => {
		const effortArray = effortEstimateOptions(team?.effort);

		const selectedEffortIndex = effortArray.findIndex((efforts) => {
			return efforts.value === currentTask?.effortEstimate;
		});

		return effortArray[selectedEffortIndex];
	};

	const extractNumber = (str: string): number =>
		Number.parseInt(str.substring(0, 2).trim(), 10);

	const { mutate: updateEffortEstimate } = useMutation({
		mutationKey: ["task", "updateEffort", taskId],
		mutationFn: async (newEffortEstimate: number) => {
			const res = await client.task.updateEffort.$post({
				taskId,
				effortEstimate: newEffortEstimate,
			});
			const updatedTask = await res.json();
			setCurrentTask({
				...currentTask,
				effortEstimate: newEffortEstimate,
			});

			const eventsRes = await client.event.getEvents.$get({
				taskId,
			});
			const updatedEvents = await eventsRes.json();
			setEvents(updatedEvents as TaskEvent[]);

			return updatedTask;
		},
		onError: (error) => {
			toast({
				title: "Error updating effort estimate",
				description: error.message,
				variant: "destructive",
			});
		},
		onSettled: () => setOpen(false),
	});

	const handleSelectEffortEstimate = (
		newEffortEstimate: Record<string, string | number>,
	) => {
		updateEffortEstimate(newEffortEstimate.value as number);
	};

	const showIcon = (estimate: number): JSX.Element => {
		switch (true) {
			case estimate > 4:
				return high();
			case estimate > 2:
				return medium();
			default:
				return low();
		}
	};

	const effortEstimate = sidebarEffortEstimate();

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex w-full items-center justify-between"
				>
					<div className="flex items-center gap-2">
						{effortEstimate ? showIcon(effortEstimate.value) : medium()}

						<span className="font-semibold text-sm">
							{effortEstimate ? extractNumber(effortEstimate.text) : "Effort"}
						</span>
					</div>
					<ChevronDown className="size-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{effortEstimateOptions(team?.effort).map((effortEstimate) => {
					const estimateNumber = extractNumber(effortEstimate.text);
					return (
						<DropdownMenuItem
							key={estimateNumber}
							onSelect={() => handleSelectEffortEstimate(effortEstimate)}
							className="flex items-center justify-between"
						>
							<div className="flex items-center gap-2">
								<span className="h-4 w-4">{showIcon(estimateNumber)}</span>
								<span>{estimateNumber}</span>
							</div>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default EffortEstimateDropdown;
