import type { labelStyle } from "@/components/LabelDropdownButton";

export interface LabelColorProps {
	name: keyof typeof labelStyle;
}

export interface LabelDropdownButtonProps {
	location: string;
}
