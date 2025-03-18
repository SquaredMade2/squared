import type {
	DisplayOptions,
	DisplayProperty,
	ViewOptions,
} from "@/store/views";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export const TaskViewOptions = ({
	view,
	showEmptyGroups,
	setOptions,
	currentOptions,
	displayProperties,
}: {
	view: string;
	showEmptyGroups: boolean;
	setOptions: (input: Partial<DisplayOptions>) => void;
	currentOptions: ViewOptions.Grid | ViewOptions.List;
	displayProperties: DisplayProperty;
}) => {
	const formatCamelCaseString = (str: string): string => {
		return str
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (char) => char.toUpperCase());
	};

	const handleToggleChange = (value: string[]) => {
		const updatedProperties = Object.keys(displayProperties).reduce(
			(acc, key) => {
				acc[key as keyof DisplayProperty] = !value.includes(key);
				return acc;
			},
			{} as DisplayProperty,
		);
		setOptions({
			viewOptions: {
				[`${view}Options`]: {
					...currentOptions,
					displayProperties: updatedProperties,
				},
			},
		} as Partial<DisplayOptions>);
	};

	return (
		<div>
			<div>{view === "grid" ? "Grid" : "List"} options</div>
			<div className="my-3 flex w-full items-center justify-between">
				<p className="py-1 text-foreground text-xs">Show Empty Groups</p>
				<Switch
					checked={showEmptyGroups}
					onCheckedChange={(checked) =>
						setOptions({
							viewOptions: {
								[`${view}Options`]: {
									...currentOptions,
									showEmptyGroups: checked,
								},
							},
						} as Partial<DisplayOptions>)
					}
				/>
			</div>
			<p className="mb-2 py-1 text-foreground text-xs">Display Properties</p>
			<ToggleGroup
				type="multiple"
				className="flex flex-wrap justify-start gap-3"
				onValueChange={handleToggleChange}
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
								className="h-6 px-2 py-0 text-xs"
							>
								{formatCamelCaseString(property)}
							</Button>
						</ToggleGroupItem>
					);
				})}
			</ToggleGroup>
		</div>
	);
};
