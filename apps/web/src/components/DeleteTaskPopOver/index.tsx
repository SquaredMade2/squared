import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { Task } from "@squared/db";
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
				<div className="flex items-center justify-center p-0 text-center text-xs">
					<DeleteTaskModal task={task} />
				</div>
			</PopoverContent>
		</Popover>
	);
}
