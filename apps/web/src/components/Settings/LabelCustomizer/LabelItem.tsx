import { LabelColor } from "@/components/ViewAllTasks/TaskCard/TaskCardLabels";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Label } from "@squared/db";
import { Ellipsis } from "lucide-react";

export const LabelItem = ({ label }: { label: Label }) => {
	console.log(label);
	return (
		<Card className="py-1 px-4 my-2">
			<div className="p-4 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<LabelColor label={label} />
					<div>
						<div className="font-bold">{label.name}</div>
						<div className="text-muted-foreground">{label.description}</div>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Ellipsis className="h-4 w-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="flex flex-col">
						<DropdownMenuItem>
							<Button variant="ghost">Edit Label</Button>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Button variant="ghost">View Label Issues</Button>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Button variant="ghost">Delete Label</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{/* <div className="flex flex-col">
				<div className="flex gap-2">
					<span className="text-lg font-bold">{label.name}</span>
					<LabelColor label={label} />
				</div>
				<div className="text-muted-foreground">{label.description}</div>
			</div> */}
		</Card>
	);
};
