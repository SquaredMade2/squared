import { useRef, useEffect, useState } from "react";
import type { TaskCardLabelsProps } from "./TaskCardLabels.interfaces";
import LabelBadge from "../LabelBadges";
import { cn } from "@/utils/cn";

export default function TaskCardLabels({ labels, view }: TaskCardLabelsProps) {
	const isGridView = view === "grid";
	const containerRef = useRef<HTMLDivElement>(null);
	const [minWidth, setMinWidth] = useState<number>(0);

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
		<div
			ref={containerRef}
			className={cn(
				"flex flex-wrap items-center justify-end text-muted-foreground gap-1 w-full",
				isGridView ? "" : "mx-5",
			)}
			style={
				{
					"--min-label-width": `${minWidth}px`,
					minWidth: "var(--min-label-width)",
					maxWidth: "100%",
				} as React.CSSProperties
			}
		>
			{labels.map((label) => (
				<div key={label.id} className="label-badge flex-shrink">
					<LabelBadge label={label} />
				</div>
			))}
		</div>
	);
}
