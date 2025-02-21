"use client";

import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { client } from "@/lib/client";
import { useEventStore, useTaskStore, useWorkspaceStore } from "@/store";
import type { Label, TaskEvent } from "@squared/db";
import { Check, Plus, Tag } from "@squared/icons";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import LabelBadge from "../../LabelBadges";

const LabelCombobox = () => {
	const [open, setOpen] = useState(false);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { currentTask, setCurrentTask } = useTaskStore((state) => state);
	const { setEvents } = useEventStore((event) => event);

	if (!currentTask) return null;

	const { id: taskId, labels } = currentTask;

	const allLabels = useMemo(() => workspace?.labels || [], [workspace]);

	const taskLabels = useMemo(
		() => allLabels.filter((label) => labels.includes(label)),
		[allLabels, labels],
	);

	const { mutate: updateLabels } = useMutation({
		mutationKey: ["task", "updateLabels", taskId],
		mutationFn: async (newLabels: Label[]) => {
			const res = await client.task.updateLabels.$post({
				taskId,
				labels: newLabels,
			});
			const updatedTask = await res.json();
			setCurrentTask({ ...currentTask, labels: newLabels });

			const eventsRes = await client.event.getEvents.$get({
				taskId,
			});
			const updatedEvents = await eventsRes.json();
			setEvents(updatedEvents as TaskEvent[]);

			return updatedTask;
		},
	});

	const handleSelectLabels = (selectedLabel: Label) => {
		if (!taskId) return;

		const updatedLabels = taskLabels.some((label) => label === selectedLabel)
			? taskLabels.filter((label) => label !== selectedLabel)
			: [...taskLabels, selectedLabel];

		updateLabels(updatedLabels);
		setOpen(false);
	};

	const renderLabelButton = () => {
		if (taskLabels.length === 0)
			return (
				<>
					<Tag className="size-4" />
					<span className="ml-2">Label</span>
				</>
			);
		if (taskLabels.length === 1)
			return (
				<>
					<LabelColor label={taskLabels[0]} />
					<span className="ml-2">{taskLabels[0].name}</span>
				</>
			);
		return (
			<div className="flex items-center">
				{taskLabels.map((label, index) => (
					<div
						key={label.name}
						className={`-mr-2.5 ${index > 0 ? "ml-1" : ""}`}
					>
						<LabelColor label={label} />
					</div>
				))}
				<span className="ml-4">{`${taskLabels.length} labels`}</span>
			</div>
		);
	};

	return (
		<div className="h-10 md:w-full">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="h-8 w-fit justify-start md:h-10 md:w-full"
					>
						<>
							<div className="item hidden items-center md:flex">
								<Plus className="mr-2 size-4" />
								<span>Add label</span>
							</div>
							<div className="flex items-center md:hidden">
								{renderLabelButton()}
							</div>
						</>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-[200px] p-0"
					side="right"
					align="start"
					sideOffset={5}
				>
					<Command>
						<CommandInput placeholder="Search labels..." />
						<CommandList>
							<CommandEmpty>No label found.</CommandEmpty>
							<CommandGroup>
								{allLabels.map((label) => (
									<CommandItem
										key={label.name}
										value={label.name}
										onSelect={() => handleSelectLabels(label)}
										className="flex items-center justify-between px-2 py-1.5"
									>
										<div className="flex items-center">
											<LabelColor label={label} />
											<span className="ml-2">{label.name}</span>
										</div>
										{taskLabels.some((taskLabel) => taskLabel === label) && (
											<Check className="size-4" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<div className="mt-2 hidden w-full md:block">
				<div className="mb-2 flex flex-wrap items-center space-x-1 space-y-2 ">
					{taskLabels.map((label: Label, index: number) => (
						<span key={label.name} className={index === 0 ? "mt-2" : ""}>
							<LabelBadge label={label} />
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default LabelCombobox;
