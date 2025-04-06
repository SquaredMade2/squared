import { Separator } from "@squaredmade/ui/separator";
import type { ReactNode } from "react";

export default function MemberSettingsWrapper({
	children,
	page,
}: { children: ReactNode; page: "workspace" | "team" }) {
	return (
		<div className="container flex w-full flex-col gap-4 py-8 md:w-3/4">
			<div className="flex flex-col items-start gap-2">
				<h1 className="text-2xl">Members</h1>
				<p className="text-muted-foreground text-xs">
					Manage members for this {page}
				</p>
			</div>
			<Separator className="mb-8" />
			{children}
		</div>
	);
}
