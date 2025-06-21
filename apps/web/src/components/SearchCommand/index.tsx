"use client";

import { useOrganization } from "@clerk/nextjs";
import { DialogTitle } from "@squaredmade/ui/dialog";
import { toast } from "@squaredmade/ui/toast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId } from "react";
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
import {
	useFilterStore,
	useModalStore,
	useTeamStore,
	useViewStore,
} from "@/store";
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
	const router = useRouter();
	const pathname = usePathname();
	const organization = useOrganization().organization;
	const showNavbar = useViewStore((state) => state.showNavbar);
	const team = useTeamStore((state) => state.team);

	const showToast = (title: string) => {
		toast.success(title);
	};

	const commandItems = new CommandSchema({
		clearFilter,
		organization,
		pathname,
		router,
		setShowNavbar,
		setShowNewTask,
		setShowSwitchWorkspace,
		setShowTaskSelector,
		showNavbar,
		showToast,
		team,
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

	const renderCommandItems = (schema: SearchbarStructure) => {
		return Object.entries(schema).map(([key, value]) => {
			if (typeof value === "string" && value === "separator") {
				return <CommandSeparator key={key} />;
			}

			return (
				<CommandGroup heading={key.includes("Ungrouped") ? "" : key} key={key}>
					{Object.entries(value).map(([subKey, subValue]) => (
						<SearchCommandItem
							item={subValue}
							key={`${key}-${subKey}`}
							setShowCommand={setShowCommand}
						/>
					))}
				</CommandGroup>
			);
		});
	};

	return (
		<CommandDialog onOpenChange={setShowCommand} open={showCommand}>
			<DialogTitle className="sr-only">Search</DialogTitle>
			<CommandInput
				autoFocus={true}
				placeholder="Type a command or search..."
			/>
			<CommandList>
				<ScrollArea className="h-[300px]">
					<CommandEmpty>No results found.</CommandEmpty>
					{renderCommandItems(commandItems.getSchema())}
				</ScrollArea>
			</CommandList>
		</CommandDialog>
	);
}

const SearchCommandItem = ({
	item,
	setShowCommand,
}: {
	item: SearchbarItem;
	setShowCommand: (show: boolean) => void;
}) => {
	const id = useId();
	return (
		<CommandItem
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
						<kbd className="mr-1" key={`${shortcut}-${id}`}>
							{shortcut}
						</kbd>
					))}
				</CommandShortcut>
			)}
		</CommandItem>
	);
};
