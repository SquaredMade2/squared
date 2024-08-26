import type { Dispatch, SetStateAction } from "react";

export type DateDropdownProps = {
	location: string;
	setDropdownOpen: Dispatch<SetStateAction<boolean>>;
	injectedTaskId: string;
};

export type Params = {
	taskId: string;
};
