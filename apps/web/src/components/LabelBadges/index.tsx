import type { Label } from "@squaredmade/db";
import { cn } from "@squaredmade/ui/cn";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";
import { useTheme } from "next-themes";

function hexToRGB(hex: string): [number, number, number] {
	const rgb = Number.parseInt(hex.slice(1), 16);
	return [(rgb >> 16) & 0xff, (rgb >> 8) & 0xff, (rgb >> 0) & 0xff];
}

function generatePaleColor(hex: string): string {
	const [r, g, b] = hexToRGB(hex);
	return `rgba(${r}, ${g}, ${b}, 0.1)`;
}

function adjustColor(hex: string, amount: number): string {
	const [r, g, b] = hexToRGB(hex);
	const newR = Math.max(0, Math.min(255, r + amount));
	const newG = Math.max(0, Math.min(255, g + amount));
	const newB = Math.max(0, Math.min(255, b + amount));
	return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

function getContrastRatio(color1: string, color2: string): number {
	const lum1 = getLuminance(color1);
	const lum2 = getLuminance(color2);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(hex: string): number {
	const rgb = hexToRGB(hex);
	const [r, g, b] = rgb.map((value) => {
		const v = value / 255;
		return v <= 0.039_28 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default function LabelBadge({ label }: { label: Label }) {
	const { resolvedTheme: theme } = useTheme();
	const isDarkMode = theme === "dark";
	const cardColor = isDarkMode ? "#1c1917" : "#ffffff";

	let adjustedColor = label.color;
	let contrastRatio = getContrastRatio(adjustedColor, cardColor);

	// Adjust color until we get a good contrast ratio
	const adjustment = isDarkMode ? 20 : -20;
	while (contrastRatio < 4.5) {
		adjustedColor = adjustColor(adjustedColor, adjustment);
		contrastRatio = getContrastRatio(adjustedColor, cardColor);
	}

	const paleColor = generatePaleColor(adjustedColor);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className={cn(
							"inline-flex cursor-default items-center rounded-full px-1.5 py-0 font-medium text-[10px]",
							"border dark:border-opacity-30",
							"transition-colors duration-200",
						)}
						style={{
							backgroundColor: paleColor,
							borderColor: adjustedColor,
							color: adjustedColor,
						}}
					>
						{label.name}
					</span>
				</TooltipTrigger>
				<TooltipContent className="cursor-default">
					{label.description}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
