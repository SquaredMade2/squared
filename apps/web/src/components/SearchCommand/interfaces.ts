import type { ReactNode } from "react";

export interface SearchbarItem {
	icon: ReactNode;
	text: string;
	function: () => void;
	shortcut: string[];
}

interface SearchbarSection {
	[key: string]: SearchbarItem;
}

export interface SearchbarStructure {
	[key: string]: SearchbarSection | "separator";
}
