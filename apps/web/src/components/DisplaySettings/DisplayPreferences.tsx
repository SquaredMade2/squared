import { Switch } from "../ui/switch";
import { useViewStore } from "@/store";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { DisplayProperty } from "@/store/views";

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
				acc[key as keyof typeof displayProperties] = !value.includes(key);
				return acc;
			},
			{} as typeof displayProperties,
		);
		setOptions({ displayProperties: updatedProperties });
	};

	return (
		<>
			<Separator className="my-2" />
			<div>{view === "grid" ? "Grid" : "List"} options</div>
			<div className="flex items-center justify-between w-full my-3">
				<p className="text-foreground text-xs py-1">Show Empty Groups</p>
				<Switch
					className="data-[state=unchecked]:bg-pink-500 focus:outline-none focus:ring-0"
					checked={showEmptyGroups}
					onCheckedChange={(checked) =>
						setOptions({ showEmptyGroups: checked })
					}
				/>
			</div>

			<ToggleGroup
				type="multiple"
				className="flex flex-wrap gap-3"
				onValueChange={handleValueChange}
			>
				{Object.keys(displayProperties).map((property) => {
					const typedKey = property as keyof DisplayProperty;
					const value = displayProperties[typedKey];
					return (
						<ToggleGroupItem
							key={property}
							value={property}
							data-state={value ? "on" : "off"}
							asChild
						>
							<Button
								variant={value ? "secondary" : "ghost"}
								size="sm"
								className="text-xs py-0 px-2 h-6"
							>
								{formatCamelCaseString(property)}
							</Button>
						</ToggleGroupItem>
					);
				})}
			</ToggleGroup>
		</>
	);
};

export default DisplayPreferences;
