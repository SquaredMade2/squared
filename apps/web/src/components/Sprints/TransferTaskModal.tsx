import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Task } from "@repo/db";

interface TransferTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	tasks: Task[];
	onConfirm: (selectedTasks: string[], sprintName: string) => void;
	initialSprintName: string;
}

export const TransferTaskModal = ({
	isOpen,
	onClose,
	tasks,
	onConfirm,
	initialSprintName,
}: TransferTaskModalProps) => {
	const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
	const [sprintName, setSprintName] = useState(initialSprintName);

	const handleTaskToggle = (taskId: string) => {
		setSelectedTasks((prev) =>
			prev.includes(taskId)
				? prev.filter((id) => id !== taskId)
				: [...prev, taskId],
		);
	};

	const handleConfirm = () => {
		onConfirm(selectedTasks, sprintName);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Select Tasks for Next Sprint</DialogTitle>
					<DialogDescription>
						Choose tasks to move to the next sprint and set the sprint name.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="sprint-name" className="text-right">
							Sprint Name
						</Label>
						<Input
							id="sprint-name"
							value={sprintName}
							onChange={(e) => setSprintName(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="max-h-[300px] overflow-y-auto">
						{tasks.map((task) => (
							<div key={task.id} className="flex items-center space-x-2">
								<Checkbox
									id={task.id}
									checked={selectedTasks.includes(task.id)}
									onCheckedChange={() => handleTaskToggle(task.id)}
								/>
								<Label htmlFor={task.id}>{task.title}</Label>
							</div>
						))}
					</div>
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
