"use client";

import { LabelCustomizer } from "@/components/Settings/LabelCustomizer";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
	return (
		<>
			<div className="md:w-3/4 w-full flex flex-col py-8 container gap-4">
				<div className="flex flex-col gap-2 items-start">
					<h1 className="text-2xl">Admin Tools</h1>
					<p className="text-xs text-muted-foreground">
						Manage labels and other admin tools for this workspace
					</p>
				</div>
				<Separator className="mb-8" />
				<LabelCustomizer />
			</div>
		</>
	);
}
