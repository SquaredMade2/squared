import { filterInProgress } from "@/components/Svg";
import type { Status } from "@repo/db";
import {
	CircleDashed,
	Circle,
	CircleFadingPlus,
	CircleCheckBig,
} from "lucide-react";

export const getStatusIcon = (status: Status) => {
	switch (status) {
		case "backlog":
			return <CircleDashed className="size-4" />;
		case "todo":
			return <Circle className="size-4" />;
		case "inProgress":
			return filterInProgress();
		case "inReview":
			return <CircleFadingPlus className="size-4 text-green-400" />;
		case "done":
			return <CircleCheckBig className="size-4 text-[#7394FF]" />;
		default:
			return <Circle className="size-4" />;
	}
};
