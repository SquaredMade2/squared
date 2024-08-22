import type { Dispatch, SetStateAction } from "react";

export type DateDropdownProps = {
	location: string;
	setDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export type Params = {
	taskId: string;
};
