import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sprintService } from "@/lib/services";
import { TODO } from "@squared/context";
import type { Task, Team } from "@squared/db";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PriorityIcon, StatusIcon } from "../Icons";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";

interface TransferTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	tasks: Task[];
	initialSprintName: string;
	team: Team | null;
	redirectUrl?: string;
}

export const TransferTaskModal = ({
	isOpen,
	onClose,
	tasks,
	team,
	initialSprintName,
	redirectUrl = "/",
}: TransferTaskModalProps) => {
	const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
	const [sprintName, setSprintName] = useState(initialSprintName);
	const router = useRouter();
	const { toast } = useToast();

	const handleTaskSelection = (task: Task) => {
		setSelectedTasks(
			selectedTasks.includes(task)
				? selectedTasks.filter((t) => t.id !== task.id)
				: [...selectedTasks, task],
		);
	};

	const handleConfirm = async () => {
		if (!team) return;
		const response = await sprintService.startNextSprint(TODO, {
			teamId: team.id,
			movedTasks: selectedTasks.map((t) => t.id),
			sprintData: {
				name: sprintName,
			},
		});
		toast(response);
		router.push(redirectUrl);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select Tasks for Next Sprint</DialogTitle>
					<DialogDescription>
						Choose tasks to move to the next sprint and set the sprint name.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="sprint-name" className="text-right md:col-span-2">
							Sprint Name
						</Label>
						<Input
							id="sprint-name"
							value={sprintName}
							onChange={(e) => setSprintName(e.target.value)}
							className="col-span-3 md:col-span-2"
						/>
					</div>
					<ScrollArea className="max-h-[300px]">
						{tasks.map((task) => (
							<div
								key={task.id}
								className="group flex items-center justify-between w-full py-2 px-4 border-b border-border hover:bg-accent"
							>
								<div className="shrink min-w-0 flex items-center gap-2">
									<Checkbox
										id={task.id}
										checked={selectedTasks.includes(task)}
										onCheckedChange={() => handleTaskSelection(task)}
										className="mr-2 flex-shrink-0"
									/>
									<PriorityIcon priority={task.priority} />
									<StatusIcon status={task.status} />
									<span className="text-sm font-medium truncate max-w-64 sm:max-w-48 md:max-w-lg">
										{task.title}
									</span>
								</div>
								<div className="flex-shrink-0 ml-2">
									{task.dueDate && (
										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{new Date(task.dueDate).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</span>
									)}
								</div>
							</div>
						))}
					</ScrollArea>
				</div>
				<DialogFooter>
					<Button type="submit" onClick={handleConfirm}>
						Confirm and Start Next Sprint
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
