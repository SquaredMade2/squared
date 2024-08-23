import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import {
	setShowPriority,
	setShowLabels,
	setShowDateTime,
} from "@/store/toggleTaskFeatures";
import { useId } from "@repo/ui/id";
import { Switch } from "../ui/switch";

const DisplayPreferences = () => {
	const dispatch = useAppDispatch();

	const { showPriority, showLabels, showDateTime } = useAppSelector(
		(state) => state.toggleTaskFeatures,
	);

	const handlePriority = (): void => {
		dispatch(setShowPriority());
	};

	const handleLabels = (): void => {
		dispatch(setShowLabels());
	};

	const handleDateTime = (): void => {
		dispatch(setShowDateTime());
	};

	const displayOptions = [
		{ label: "Priority", show: showPriority, handle: handlePriority },
		{ label: "Labels", show: showLabels, handle: handleLabels },
		{ label: "Date and Time", show: showDateTime, handle: handleDateTime },
	];

	return (
		<div>
			<ul>
				{displayOptions.map((option) => (
					<div
						className="flex items-center justify-between w-full"
						key={useId()}
					>
						<p className="text-foreground text-xs py-1 mb-1 last:mb-0">
							{option.label}
						</p>
						<Switch checked={option.show} onClick={option.handle} />
					</div>
				))}
			</ul>
		</div>
	);
};

export default DisplayPreferences;
