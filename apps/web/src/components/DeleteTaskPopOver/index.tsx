import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";

export default function DeleteTaskPopOver() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost">
					<Ellipsis />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-24 p-1">
				<p className="text-xs text-center">
					<Button variant="ghost">Delete</Button>
				</p>
			</PopoverContent>
		</Popover>
	);
}
