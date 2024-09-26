import { Switch } from "../ui/switch";
import { useViewStore } from "@/store";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const DisplayPreferences = () => {
	const {
		view,
		listViewOptions,
		gridViewOptions,
		setListViewOptions,
		setGridViewOptions,
	} = useViewStore((state) => state);

	const currentOptions = view === "grid" ? gridViewOptions : listViewOptions;
	const setOptions = view === "grid" ? setGridViewOptions : setListViewOptions;

	const { showEmptyGroups, displayProperties } = currentOptions;

	const formatCamelCaseString = (str: string): string => {
		return str
			.replace(/([A-Z])/g, " $1") // Insert space before each capital letter
			.replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter of the string
	};

	// might need later
	// const getFormattedKeyString = (obj: Partial<ViewOptions> | DisplayProperty) => {
	// 	return Object.keys(obj)
	// 		.map((key) => key.replace(/([A-Z])/g, " $1"))
	// 		.join(", ")
	// 		.replace(/\b\w/g, (char) => char.toUpperCase());
	// };

	const handleValueChange = (value: string[]) => {
		const updatedProperties = Object.keys(displayProperties).reduce(
			(acc, key) => {
				acc[key as keyof typeof displayProperties] = value.includes(key);
				return acc;
			},
			{} as typeof displayProperties,
		);
		setOptions({ displayProperties: updatedProperties });
	};

	return (
		<div>
			<Separator className="my-2" />
			<div className="mb-3">Display Properties</div>
			<ToggleGroup
				type="multiple"
				className="flex flex-wrap gap-3"
				onValueChange={handleValueChange}
			>
				{Object.keys(displayProperties).map((property) => (
					<ToggleGroupItem key={property} value={property} className="border">
						{formatCamelCaseString(property)}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<Separator className="my-3" />
			<div className="flex items-center justify-between w-full">
				<p className="text-foreground text-xs py-1 mb-1 last:mb-0">
					Show Empty Groups
				</p>
				<Switch
					className="data-[state=unchecked]:bg-pink-500 focus:outline-none focus:ring-0"
					checked={showEmptyGroups}
					onCheckedChange={(checked) =>
						setOptions({ showEmptyGroups: checked })
					}
				/>
			</div>
		</div>
	);
};

export default DisplayPreferences;
