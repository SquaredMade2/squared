import type { ReactElement } from "react";

type Shortcut = string[];
export interface SearchbarItem {
	icon: ReactElement | string;
	text: string;
	function: () => void;
	shortcut: Shortcut;
	placeholder?: boolean;
}

export interface SearchbarSection {
	[key: string]: SearchbarItem | SearchbarSection | string;
}

export interface SearchbarStructure {
	[key: string]: SearchbarSection | "separator" | SearchbarItem;
}
