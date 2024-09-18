import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import type { NotificationType } from "@repo/db";

type SidebarProps = {
	setFilterType: (type: NotificationType) => void;
	setWorkspace: (workspace: string) => void;
};

export function InboxSidebar({ setFilterType, setWorkspace }: SidebarProps) {
	return (
		<div className="w-64 ml-14 border-r border-border h-full md:block hidden p-4">
			<nav>
				<ul className="space-y-2">
					<li>
						<Button variant="ghost" className="w-full justify-start">
							Inbox
						</Button>
					</li>
					<li>
						<Button variant="ghost" className="w-full justify-start">
							Saved
						</Button>
					</li>
					<li>
						<Button variant="ghost" className="w-full justify-start">
							Read
						</Button>
					</li>
					<Separator />
					<li>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setFilterType("ASSIGNED")}
						>
							Assigned
						</Button>
					</li>
					<li>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setFilterType("PARTICIPATING")}
						>
							Participating
						</Button>
					</li>
					<li>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setFilterType("MENTIONED")}
						>
							Mentioned
						</Button>
					</li>
					<li>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setFilterType("CREATED")}
						>
							Created
						</Button>
					</li>
					<Separator />
					{/* TODO: ADD WORKSPACE FILTERS */}
					<li>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setWorkspace("all")}
						>
							All Workspaces
						</Button>
					</li>
					{/* Add more workspace buttons as needed */}
				</ul>
			</nav>
		</div>
	);
}
