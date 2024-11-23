import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";
import DeleteTaskModal from "../DeleteTaskModal";

export default function DeleteTaskPopOver() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost">
					<Ellipsis />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-24 p-1">
				<div className="text-xs text-center">
					<DeleteTaskModal />
				</div>
			</PopoverContent>
		</Popover>
	);
}
