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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";
// import type { Sprint, Task } from "@squared/db";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface DesignationComboboxProps<T> {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	triggerText: string;
	emptyText: string;
	listItems: T[];
	selectedItemId: string | null;
	selectedItemLabel: string | null;
	itemLabel: (item: T) => string;
	itemId: (item: T) => string;
	onItemSelect: (itemId: string | null) => void;
}

export function DesignationCombobox<T>({
	open,
	setOpen,
	triggerText,
	emptyText,
	listItems,
	selectedItemId,
	selectedItemLabel,
	itemLabel,
	itemId,
	onItemSelect,
}: DesignationComboboxProps<T>) {
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="justify-between w-full">
					{triggerText}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("p-0 w-[200px]")}>
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>{emptyText}</CommandEmpty>
							<CommandGroup>
								{selectedItemLabel && (
									<CommandItem onSelect={() => onItemSelect(null)}>
										Unassign from {selectedItemLabel}
									</CommandItem>
								)}
								{listItems.map((item) => (
									<CommandItem
										key={itemId(item)}
										onSelect={() => onItemSelect(itemId(item))}
										className="w-full"
									>
										{itemLabel(item)}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												selectedItemId === itemId(item)
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
