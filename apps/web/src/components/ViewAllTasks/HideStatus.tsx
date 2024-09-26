import type { HideStatusProps } from "./interfaces";
import { EllipsisVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const HideStatus = ({ setShowTasks, showTasks }: HideStatusProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<EllipsisVertical className="cursor-pointer size-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => setShowTasks(!showTasks)}
					className="cursor-pointer"
				>
					{showTasks ? "Hide" : "Unhide"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default HideStatus;
