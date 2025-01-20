import type { Task } from "@squared/db";
import { Button } from "@squaredmade/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squaredmade/ui/popover";
import { Ellipsis } from "lucide-react";
import DeleteTaskModal from "../DeleteTaskModal";

export default function DeleteTaskPopOver({ task }: { task: Task }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost">
					<Ellipsis />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-24 p-0">
				<div className="text-xs text-center flex items-center justify-center p-0">
					<DeleteTaskModal task={task} />
				</div>
			</PopoverContent>
		</Popover>
	);
}
