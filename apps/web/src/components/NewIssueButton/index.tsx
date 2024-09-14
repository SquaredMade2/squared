import { SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import ButtonIcon from "../ButtonIcon";
import type { Status } from "@repo/db";
import { useModalStore } from "@/storeZ";
import { useTheme } from "next-themes";
const NewIssueButton = () => {
	const { showNewIssue, setShowNewIssue, newIssueData, setNewIssueData } =
		useModalStore((state) => state);
	const { theme } = useTheme();
	const titleArr: { status: Status } = { status: "todo" };

	const fillColor = () => (theme === "light" ? "#174EFF" : "white");
	const handleOpen = () => {
		setShowNewIssue(true);
		setNewIssueData({
			...newIssueData,
			status: titleArr.status,
		});
	};

	return (
		<button
			type="button"
			className="flex flex-row w-full h-12 items-center justify-center border border-blue-800 shadow-lg rounded focus:outline-none focus:shadow-sm active:shadow-lg cursor-pointer hover:shadow-glow text-blue-600 dark:text-foreground "
			onClick={() => handleOpen()}
		>
			<span>
				<SquarePen className={`size-5 cursor-pointer fill-[${fillColor()}]`} />
			</span>
			<span className="px-2 w-auto text-foreground, cursor-pointer">
				{Object.keys(newIssueData).length > 0 && !showNewIssue
					? "Resume editing"
					: "New Issue"}
			</span>
			{Object.keys(newIssueData).length > 0 && !showNewIssue && (
				<div className="w-1.5 h-1.5 rounded-md bg-accent border-border ml-2" />
			)}
		</button>
	);
};

export const GridColumnNewIssueButton = ({ status }: { status: Status }) => {
	const { theme } = useTheme();
	const { setShowNewIssue, newIssueData, setNewIssueData } = useModalStore(
		(state) => state,
	);
	const fillColor = () => (theme === "light" ? "#174EFF" : "white");
	const handleOpen = () => {
		setShowNewIssue(true);
		setNewIssueData({
			...newIssueData,
			status,
		});
	};
	return (
		<Button onClick={() => handleOpen()} variant={"outline"} className="w-full">
			<SquarePen className={`size-5 cursor-pointer fill-[${fillColor()}]`} />
		</Button>
	);
};

export const SideNavNewIssueButton = () => {
	const titleArr: { status: Status } = { status: "todo" };
	const { setShowNewIssue, newIssueData, setNewIssueData } = useModalStore(
		(state) => state,
	);
	const handleOpen = () => {
		setShowNewIssue(true);
		setNewIssueData({
			...newIssueData,
			status: titleArr.status,
		});
	};

	return (
		<ButtonIcon
			icon={<FontAwesomeIcon icon={faPenToSquare} />}
			handleClick={handleOpen}
			hoverBg="bg-card"
			tooltipLabel="New Issue"
			labelPosition="right"
		/>
	);
};

export default NewIssueButton;
