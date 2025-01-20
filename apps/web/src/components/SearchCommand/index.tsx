"use client";

import { useFilterStore, useModalStore, useViewStore } from "@/store";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@squared/ui/command";
import { DialogTitle } from "@squared/ui/dialog";
import { useToast } from "@squared/ui/hooks";
import { useId } from "@squared/ui/hooks";
import { ScrollArea } from "@squared/ui/scroll-area";
import { VisuallyHidden } from "@squared/ui/visually-hidden";
import { useEffect } from "react";
import { CommandSchema } from "./actions";
import type { SearchbarItem, SearchbarStructure } from "./interfaces";

export default function SearchCommand() {
	const { toast } = useToast();
	const {
		setShowNewTask,
		showCommand,
		setShowCommand,
		setShowSwitchWorkspace,
		setShowTaskSelector,
	} = useModalStore((state) => state);
	const { setShowNavbar } = useViewStore((state) => state);
	const { clearFilter } = useFilterStore((state) => state);

	const showToast = (
		title: string,
		variant?: "destructive" | "default" | null,
	) => {
		toast({ title, variant });
	};

	const commandItems = new CommandSchema({
		setShowNewTask,
		setShowSwitchWorkspace,
		setShowNavbar,
		setShowTaskSelector,
		clearFilter,
		showToast,
	});

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setShowCommand(!showCommand);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [setShowCommand, showCommand]);

	const renderCommandItem = (item: SearchbarItem, key: string) => (
		<CommandItem
			key={key}
			onSelect={() => {
				item.function();
				setShowCommand(false);
			}}
		>
			{item.icon}
			<span>{item.text}</span>
			{item.shortcut.length > 0 && (
				<CommandShortcut>
					{item.shortcut.map((shortcut) => (
						<kbd key={`${shortcut}-${useId()}`} className="mr-1">
							{shortcut}
						</kbd>
					))}
				</CommandShortcut>
			)}
		</CommandItem>
	);

	const renderCommandItems = (schema: SearchbarStructure) => {
		return Object.entries(schema).map(([key, value]) => {
			if (typeof value === "string" && value === "separator") {
				return <CommandSeparator key={key} />;
			}

			return (
				<CommandGroup key={key} heading={key.includes("Ungrouped") ? "" : key}>
					{Object.entries(value).map(([subKey, subValue]) =>
						renderCommandItem(subValue, `${key}-${subKey}`),
					)}
				</CommandGroup>
			);
		});
	};

	return (
		<CommandDialog open={showCommand} onOpenChange={setShowCommand}>
			<VisuallyHidden>
				<DialogTitle>Search</DialogTitle>
			</VisuallyHidden>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<ScrollArea className="h-[300px]">
					<CommandEmpty>No results found.</CommandEmpty>
					{renderCommandItems(commandItems.getSchema())}
				</ScrollArea>
			</CommandList>
		</CommandDialog>
	);
}
