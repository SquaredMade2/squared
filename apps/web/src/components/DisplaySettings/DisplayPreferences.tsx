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
		listViewOptions,
		gridViewOptions,
		setShowPriority,
		setShowLabels,
		setShowDateTime,
		setListViewOptions,
		setGridViewOptions,
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

	const getFormattedKeyString = (obj: { showEmptyGroups?: boolean }) => {
		return Object.keys(obj)
			.map((key) => key.replace(/([A-Z])/g, " $1"))
			.join(", ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
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
						<Switch
							className="data-[state=unchecked]:bg-pink-500 focus:outline-none focus:ring-0"
							checked={option.show}
							onClick={option.handle}
						/>
					</div>
				))}
				<Separator className="my-2" />
				{view === "grid" && (
					<div className="flex items-center justify-between w-full">
						<p className="text-foreground text-xs py-1 mb-1 last:mb-0 capitalize">
							{getFormattedKeyString(gridViewOptions)}
						</p>
						<Switch
							className="data-[state=unchecked]:bg-pink-500 focus:outline-none focus:ring-0"
							checked={gridViewOptions.showEmptyGroups}
							onCheckedChange={(checked) =>
								setGridViewOptions({ showEmptyGroups: checked })
							}
						/>
					</div>
				)}
				{view === "list" && (
					<div className="flex items-center justify-between w-full">
						<p className="text-foreground text-xs py-1 mb-1 last:mb-0 capitalize">
							{getFormattedKeyString(listViewOptions)}
						</p>
						<Switch
							className="data-[state=unchecked]:bg-pink-500 focus:outline-none focus:ring-0"
							checked={listViewOptions.showEmptyGroups}
							onCheckedChange={(checked) =>
								setListViewOptions({ showEmptyGroups: checked })
							}
						/>
					</div>
				)}
			</ul>
		</div>
	);
};

export default DisplayPreferences;
