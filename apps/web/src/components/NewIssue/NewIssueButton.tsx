import { SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import type { Status } from "@repo/db";
import { useModalStore } from "@/store";

export const NewIssueButton = () => {
	const { showNewIssue, setShowNewIssue, newIssueData, setNewIssueData } =
		useModalStore((state) => state);
	const titleArr: { status: Status } = { status: "todo" };

	const handleOpen = () => {
		setShowNewIssue(true);
		setNewIssueData({
			...newIssueData,
			status: titleArr.status,
		});
	};

	return (
		<Button
			variant="outline"
			className="shadow-lg border-blue-500 hover:shadow-glow"
			onClick={handleOpen}
		>
			<span>
				<SquarePen className="size-5" />
			</span>
			<span className="px-2 w-auto">
				{Object.keys(newIssueData).length > 0 && !showNewIssue
					? "Resume editing"
					: "New Issue"}
			</span>
			{Object.keys(newIssueData).length > 0 && !showNewIssue && (
				<div className="w-1.5 h-1.5 rounded-md bg-accent border-border ml-2" />
			)}
		</Button>
	);
};

export const GridColumnNewIssueButton = ({ status }: { status: Status }) => {
	const { setShowNewIssue, newIssueData, setNewIssueData } = useModalStore(
		(state) => state,
	);

	const handleOpen = () => {
		setShowNewIssue(true);
		setNewIssueData({
			...newIssueData,
			status,
		});
	};
	return (
		<Button onClick={() => handleOpen()} variant={"outline"} className="w-full">
			<SquarePen className="size-5" />
		</Button>
	);
};
