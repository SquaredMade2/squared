"use client";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilterStore, useModalStore, useViewStore } from "@/store";
import { DialogTitle } from "@squaredmade/ui/dialog";
import { toast } from "@squaredmade/ui/toast";
import { useId } from "@squaredmade/ui/use-id";
import { VisuallyHidden } from "@squaredmade/ui/visually-hidden";
import { useEffect } from "react";
import { CommandSchema } from "./actions";
import type { SearchbarItem, SearchbarStructure } from "./interfaces";

export default function SearchCommand() {
	const {
		setShowNewTask,
		showCommand,
		setShowCommand,
		setShowSwitchWorkspace,
		setShowTaskSelector,
	} = useModalStore((state) => state);
	const { setShowNavbar } = useViewStore((state) => state);
	const { clearFilter } = useFilterStore((state) => state);

	const showToast = (title: string) => {
		toast.success(title);
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
			<CommandInput placeholder="Type a command or search..." autoFocus />
			<CommandList>
				<ScrollArea className="h-[300px]">
					<CommandEmpty>No results found.</CommandEmpty>
					{renderCommandItems(commandItems.getSchema())}
				</ScrollArea>
			</CommandList>
		</CommandDialog>
	);
}
