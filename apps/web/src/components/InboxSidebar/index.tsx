import type { NotificationFilter } from "@/app/inbox/page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SidebarProps = {
	setFilterType: (type: NotificationFilter) => void;
	setWorkspace: (workspace: string) => void;
	filterType: NotificationFilter;
};

export default function InboxSidebar({
	setFilterType,
	setWorkspace,
	filterType,
}: SidebarProps) {
	const FilterButton = ({
		type,
		children,
	}: { type: NotificationFilter; children: React.ReactNode }) => (
		<Button
			variant="ghost"
			className={`w-full justify-start relative ${
				filterType === type ? "bg-accent text-primary" : ""
			}`}
			onClick={() => setFilterType(type)}
		>
			{filterType === type && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />
			)}
			{children}
		</Button>
	);
	console.log("filterType", filterType);

	return (
		<div className="w-64 ml-14 border-r border-border h-full md:block hidden p-4">
			<nav>
				<ul className="space-y-2">
					<li>
						<FilterButton type="INBOX">Inbox</FilterButton>
					</li>
					<li>
						<FilterButton type="SAVED">Saved</FilterButton>
					</li>
					<li>
						<FilterButton type="READ">Read</FilterButton>
					</li>
					<Separator />
					<li>
						<FilterButton type="ASSIGNED">Assigned</FilterButton>
					</li>
					<li>
						<FilterButton type="PARTICIPATING">Participating</FilterButton>
					</li>
					<li>
						<FilterButton type="MENTIONED">Mentioned</FilterButton>
					</li>
					<li>
						<FilterButton type="CREATED">Created</FilterButton>
					</li>
					<Separator />
					<li>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setWorkspace("all")}
						>
							All Workspaces
						</Button>
					</li>
				</ul>
			</nav>
		</div>
	);
}
