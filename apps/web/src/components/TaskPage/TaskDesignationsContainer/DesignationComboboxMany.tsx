import { Check, ChevronsUpDown } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squaredmade/ui/popover";
import type { Dispatch, SetStateAction } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

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
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild>
				<Button className="w-full justify-between" variant="outline">
					{triggerText}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-[200px] p-0")}>
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>{emptyText}</CommandEmpty>
							<CommandGroup>
								{listItems.map((item) => (
									<CommandItem
										className="w-full"
										key={itemId(item)}
										onSelect={() => onItemSelect(itemId(item))}
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
