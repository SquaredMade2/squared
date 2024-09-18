import { commandSchema } from "./actions";
import { DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@repo/ui/visually-hidden";
import type {
	SearchbarItem,
	SearchbarSection,
} from "./SearchCommand.interface";
import {
	CommandList,
	CommandItem,
	CommandInput,
	CommandGroup,
	CommandEmpty,
	CommandDialog,
	CommandShortcut,
	CommandSeparator,
} from "../ui/command";
import { useToast } from "../ui/use-toast";
import { useModalStore, useFilterStore } from "@/store";

const SearchCommand = () => {
	const { toast } = useToast();
	const [lastKey, setLastKey] = useState<string>("");
	const [isInputFocus, setIsInputFocus] = useState<boolean>(true);
	const { setShowNewIssue, showCommand, setShowCommand } = useModalStore(
		(state) => state,
	);
	const { clearFilter } = useFilterStore((state) => state);
	const showToast = (
		title: string,
		variant?: "destructive" | "default" | null,
	) => {
		toast({ title, variant });
	};
	const commandItems = new commandSchema(
		setShowNewIssue,
		clearFilter,
		showToast,
	);

	useEffect(() => {
		const down = (e: KeyboardEvent): void => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setShowCommand(true);
			}
			if (e.key === "Escape") {
				setShowCommand(false);
			}
			if (!showCommand || isInputFocus) return;

			if (e.key.toLowerCase() === "c" && lastKey === "shift" && e.ctrlKey) {
				const item = commandItems.getSchema()["Copy current page URL"];
				if (isSearchbarItem(item)) {
					item.function();
				}
				setShowCommand(false);
				return;
			}
			if (e.altKey && e.shiftKey && e.key === "Œ") {
				// @ts-ignore comment
				commandItems.getSchema().Account.logOut.function();
				setShowCommand(false);
				return;
			}
			if (e.key.toLowerCase() === "c") {
				// @ts-ignore comment
				commandItems.getSchema().Issue.createNewIssue.function();
				setShowCommand(false);
				return;
			}
			if (lastKey === "g" && e.key.toLowerCase() === "i") {
				const item = commandItems.getSchema()["Go to inbox"];
				if (isSearchbarItem(item)) {
					item.function();
				}
				setShowCommand(false);
				return;
			}
			if (lastKey === "g" && e.key.toLowerCase() === "a") {
				const item = commandItems.getSchema()["Go to active issues"];
				if (isSearchbarItem(item)) {
					item.function();
				}
				setShowCommand(false);
				return;
			}

			if (lastKey === "g" && e.key.toLowerCase() === "b") {
				const item = commandItems.getSchema()["Go to backlog"];
				if (isSearchbarItem(item)) {
					item.function();
				}
				setShowCommand(false);
				return;
			}

			if (lastKey === "g" && e.key.toLowerCase() === "e") {
				const item = commandItems.getSchema()["Go to all issues"];
				if (isSearchbarItem(item)) {
					item.function();
				}
				setShowCommand(false);
				return;
			}
			if (lastKey === "g" && e.key.toLowerCase() === "u") {
				const item = commandItems.getSchema()["Go to views"];
				if (isSearchbarItem(item)) {
					item.function();
				}
				setShowCommand(false);
				return;
			}
			setLastKey(e.key.toLowerCase());
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [showCommand, isInputFocus, lastKey]);

	return (
		<CommandDialog open={showCommand} onOpenChange={setShowCommand}>
			<VisuallyHidden>
				<DialogTitle>Searchbar</DialogTitle>
			</VisuallyHidden>
			<CommandInput
				placeholder="Type a command or search..."
				onFocusCapture={() => setIsInputFocus(true)}
				onBlurCapture={() => setIsInputFocus(false)}
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				{Object.entries(commandItems.getSchema()).map(([key, value]) => {
					if (value === "separator") {
						return <CommandSeparator key={key} />;
					}
					if (isSearchbarItem(value)) {
						return commandItem(value as SearchbarItem, setShowCommand, key);
					}
					return (
						<CommandGroup
							key={key}
							heading={key}
							style={{ pointerEvents: "auto" }}
							className="[&_[cmdk-group-heading]]:text-[]"
						>
							{Object.entries(value as SearchbarSection).map(
								([key1, value1]) => {
									return commandItem(
										value1 as SearchbarItem,
										setShowCommand,
										key1,
									);
								},
							)}
						</CommandGroup>
					);
				})}
			</CommandList>
		</CommandDialog>
	);
};

export default SearchCommand;

const isSearchbarItem = (
	value: SearchbarItem | SearchbarSection | string,
): value is SearchbarItem => {
	return (value as SearchbarItem).text !== undefined;
};

const commandItem = (
	value: SearchbarItem,
	setShowCommand: (open: boolean) => void,
	key?: string,
) => {
	function handleClick() {
		value.function();
		setShowCommand(false);
	}
	return (
		<CommandItem
			key={key ?? value.text}
			onClickCapture={handleClick}
			className="data-[disabled]:opacity-100 cursor-pointer aria-selected:text-[]"
			style={{ pointerEvents: "auto" }}
		>
			<span className="size-4 mb-1">{value.icon}</span>
			<span className="ml-3 cursor-pointer">{value.text}</span>
			<CommandShortcut className="opacity-100 text-foreground cursor-pointer">
				{value.shortcut?.map((item: string, index: number) => {
					return (
						<span
							key={item}
							className={`${
								item === "then"
									? "text-[#9BA3AF] dark:text-[#858698]"
									: "py-[2px] px-[4px] border rounded-sm border-[#DCE0E4] dark:border-[#2C2C3B]  bg-[#E0E0E5] dark:bg-[#2A3045] "
							}
                 cursor-pointer
                ${index === value.shortcut.length - 1 ? "" : "mr-1"} `}
						>
							{item}
						</span>
					);
				})}
			</CommandShortcut>
		</CommandItem>
	);
};
