import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

export default function MemberSettingsWrapper({
	children,
	page,
}: { children: ReactNode; page: "workspace" | "team" }) {
	return (
		<div className="md:w-3/4 w-full flex flex-col py-8 container gap-4">
			<div className="flex flex-col gap-2 items-start">
				<h1 className="text-2xl">Members</h1>
				<p className="text-xs text-muted-foreground">
					Manage members for this {page}
				</p>
			</div>
			<Separator className="mb-8" />
			{children}
		</div>
	);
}
