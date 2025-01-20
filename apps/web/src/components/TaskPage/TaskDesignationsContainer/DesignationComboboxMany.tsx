import { Button } from "@squared/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@squared/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squared/ui/popover";
import { ScrollArea } from "@squared/ui/scroll-area";
import { cn } from "@/utils/cn";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface DesignationComboboxProps<T> {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	triggerText: string;
	emptyText: string;
	listItems: T[];
	selectedItemIds: string[] | null;
	itemLabel: (item: T) => string;
	itemId: (item: T) => string;
	onItemSelect: (itemId: string) => void;
}

export function DesignationComboboxMany<T>({
	open,
	setOpen,
	triggerText,
	emptyText,
	listItems,
	selectedItemIds,
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
												selectedItemIds?.find((t) => t === itemId(item))
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
