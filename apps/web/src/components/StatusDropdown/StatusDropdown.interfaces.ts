import type { Dispatch, SetStateAction } from "react";

export interface StatusDropdownProps {
	location: string;
	showIcon(name: string): React.ReactNode;
	setDropdownOpen: Dispatch<SetStateAction<boolean>>;
}
