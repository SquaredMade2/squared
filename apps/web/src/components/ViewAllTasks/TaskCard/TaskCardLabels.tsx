import LabelBadge from "@/components/LabelBadges";
import { useViewStore } from "@/store";
import { cn } from "@/utils/cn";
import type { Label } from "@squared/db";
import { useEffect, useRef, useState } from "react";
import type { TaskCardLabelsProps } from "./interfaces";

export const LabelColor = ({ label }: { label: Label }) => {
	const { color } = label;
	const validatedColor = color.startsWith("#") ? color : `#${color}`;
	return (
		<div
			className="w-3 h-3 rounded-lg"
			style={{ backgroundColor: validatedColor }}
		/>
	);
};

export default function TaskCardLabels({ labels }: TaskCardLabelsProps) {
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
					className={cn(
						`flex flex-wrap items-center justify-end text-muted-foreground gap-1 w-fit max-w-full min-w-[${minWidth}px] `,
					)}
				>
					{labels.map((label) => (
						<div key={label.id} className="label-badge flex-shrink">
							<LabelBadge label={label} />
						</div>
					))}
				</div>
			) : (
				<>
					{labels.map((label) => (
						<div key={label.id} className="label-badge flex-shrink mb-1">
							<LabelBadge label={label} />
						</div>
					))}
				</>
			)}
		</>
	);
}
