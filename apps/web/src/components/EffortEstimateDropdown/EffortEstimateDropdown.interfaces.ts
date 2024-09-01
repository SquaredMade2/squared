import type { Dispatch, SetStateAction } from "react";

export type EffortEstimateDropdownProps = {
	location: string;
	showIcon(estimate: number): React.ReactNode;
	setDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export type Params = {
	taskId: string;
};
