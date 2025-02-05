"use client";

import { Separator } from "@squaredmade/ui/separator";

export default function LabelsPage() {
	return (
		<div className="container flex w-full flex-col gap-4 py-8 md:w-3/4">
			<div className="flex flex-col items-start gap-2">
				<h1 className="text-2xl">Labels</h1>
				<p className="text-muted-foreground text-xs">
					Manage labels for this workspace
				</p>
			</div>
			<Separator className="mb-8" />
			<LabelsPage />
		</div>
	);
}
