import type { Label } from "@repo/db";

export interface LabelDropdownProps {
	labelOptions: Label[];
	location: string;
	handleButtonClick: () => void;
	handleClickAway: () => void;
}
