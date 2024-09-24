import { useId } from "@repo/ui/id";
import { Switch } from "../ui/switch";
import { useViewStore } from "@/store";
import { Separator } from "../ui/separator";

const DisplayPreferences = () => {
	const {
		view,
		showPriority,
		showLabels,
		showDateTime,
		showHiddenStatus,
		setShowPriority,
		setShowLabels,
		setShowDateTime,
		setShowHiddenStatus,
	} = useViewStore((state) => state);

	const handlePriority = (): void => {
		setShowPriority(!showPriority);
	};

	const handleLabels = (): void => {
		setShowLabels(!showLabels);
	};

	const handleDateTime = (): void => {
		setShowDateTime(!showDateTime);
	};

	const handleHiddenToggle = (): void => {
		setShowHiddenStatus(!showHiddenStatus);
	};

	const displayOptions = [
		{ label: "Priority", show: showPriority, handle: handlePriority },
		{ label: "Labels", show: showLabels, handle: handleLabels },
		{ label: "Date and Time", show: showDateTime, handle: handleDateTime },
	];

	const hiddenStatusOptions = {
		label: "Show Empty Groups",
		show: showHiddenStatus,
		handle: handleHiddenToggle,
	};

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
						<Switch
							className="data-[state=unchecked]:bg-pink-500 focus:outline-none focus:ring-0"
							checked={option.show}
							onClick={option.handle}
						/>
					</div>
				))}
				{view === "grid" && (
					<>
						<Separator className="my-2" />
						<div className="flex items-center justify-between w-full">
							<p className="text-foreground text-xs py-1 mb-1 last:mb-0">
								{hiddenStatusOptions.label}
							</p>
							<Switch
								className="data-[state=unchecked]:bg-pink-500 focus:outline-none focus:ring-0"
								checked={hiddenStatusOptions.show}
								onClick={hiddenStatusOptions.handle}
							/>
						</div>
					</>
				)}
			</ul>
		</div>
	);
};

export default DisplayPreferences;
