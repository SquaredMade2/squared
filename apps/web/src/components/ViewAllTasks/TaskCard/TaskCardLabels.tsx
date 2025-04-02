import LabelBadge from "@/components/LabelBadges";
import { useViewStore } from "@/store";
import type { Label } from "@squaredmade/db";
import { useEffect, useRef, useState } from "react";
import type { TaskCardLabelsProps } from "./interfaces";

export const LabelColor = ({ label }: { label: Label }) => {
	const { color } = label;
	const validatedColor = color.startsWith("#") ? color : `#${color}`;
	return (
		<div
			className="h-3 w-3 rounded-lg"
			style={{ backgroundColor: validatedColor }}
		/>
	);
};

export default function Labels({ labels }: TaskCardLabelsProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [minWidth, setMinWidth] = useState<number>(0);
	const { view } = useViewStore((state) => state);

	useEffect(() => {
		if (containerRef.current) {
			const labelElements =
				containerRef.current.querySelectorAll(".label-badge");
			let maxWidth = 0;
			for (const el of labelElements) {
				const width = (el as HTMLElement).offsetWidth;
				if (width > maxWidth) {
					maxWidth = width;
				}
			}
			setMinWidth(maxWidth);
		}
	}, [labels]);

	return (
		<>
			{view === "list" ? (
				<div
					ref={containerRef}
					className="flex w-fit max-w-full flex-wrap items-center justify-end gap-1 text-muted-foreground"
					style={{ minWidth: minWidth > 0 ? `${minWidth}px` : undefined }}
				>
					{labels.map((label) => (
						<div key={label.name} className="label-badge shrink">
							<LabelBadge label={label} />
						</div>
					))}
				</div>
			) : (
				<>
					{labels.map((label) => (
						<div key={label.name} className="label-badge mb-1 shrink">
							<LabelBadge label={label} />
						</div>
					))}
				</>
			)}
		</>
	);
}
