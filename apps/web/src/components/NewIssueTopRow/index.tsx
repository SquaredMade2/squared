import NewIssueCloseButton from "@/components/NewIssueCloseButton";
import { useSelector } from "react-redux";
import type { Team } from "@/store/taskData/taskData.interfaces";
import type { UserSettingsState } from "@/store/userSettings/userSettings.interfaces";
import type { NewIssueTopRowProps } from "./NewIssueTopRow.interfaces";
import { ChevronLeft, LayoutGrid } from "lucide-react";

const NewIssueTopRow = ({
	showCloseModal,
	handleCloseClick,
	handleCancelClose,
	handleDiscard,
}: NewIssueTopRowProps) => {
	const { theme } = useSelector((state: UserSettingsState) => state);
	const { identifier } = useSelector((state: Team) => state);
	const handleBackground = () =>
		`bg-popover${theme === "light" ? "" : "Hover"}`;

	return (
		<div className="flex flex-row items-center justify-between text-sm w-full px-3 pt-3 pb-1.5">
			<div className="flex flex-row items-center">
				<div
					className={`flex flex-row items-center text-muted-foreground text-small border border-border rounded-md shadow-md px-2 py-0.5 ${handleBackground()}`}
				>
					<div className="pl-1 mr-1">
						<LayoutGrid className="text-[#9577FF] size-4" />
					</div>
					<div className="text-xs">{identifier}</div>
				</div>
				<div className="flex flex-row items-center">
					<div className="rotate-180 h-2 w-2 opacity-50 ml-2 mr-1.5 mt-1">
						<ChevronLeft className="size-4 text-[#6b6f75] cursor-pointer" />
					</div>
					<div className="text-xs">New Issue</div>
				</div>
			</div>
			<div className="flex flex-row items-center">
				<NewIssueCloseButton
					showCloseModal={showCloseModal}
					handleCloseClick={handleCloseClick}
					handleCancelClose={handleCancelClose}
					handleDiscard={handleDiscard}
				/>
			</div>
		</div>
	);
};

export default NewIssueTopRow;
