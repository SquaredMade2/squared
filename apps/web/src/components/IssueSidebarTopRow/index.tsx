import React, { useCallback, useEffect, useState } from "react";
import { formatUrl, replaceSpacesWithDashes } from "@/utils/formatting";
import CopyTaskUrl from "../CopyTaskUrl";
import CopyTaskId from "../CopyTaskId";
import CopyGitBranchName from "../CopyGitBranchName";
import { useTaskStore, useTeamStore } from "@/storeZ";

const IssueSidebarTopRow = () => {
	const currentTask = useTaskStore((state) => state.currentTask);
	const [isUrlClicked, setIsUrlClicked] = useState(false);
	const [isIdClicked, setIsIdClicked] = useState(false);
	const [isBranchClicked, setIsBranchClicked] = useState(false);

	const identifier = currentTask?.identifier ?? "";
	const title = currentTask?.title ?? "";

	const currentTeam = useTeamStore((state) => state.currentTeam);
	const TaskUrl = `/${currentTeam?.name ?? ""}/task/${identifier}/${formatUrl(title)}`;
	const gitBranchName = `
			${replaceSpacesWithDashes(
				`${title.toLowerCase()}-${String(identifier).toLowerCase()}`,
			)}`;

	const copyUrl = async (): Promise<void> => {
		await window.navigator.clipboard.writeText(TaskUrl);
		setIsUrlClicked(true);
		setTimeout(() => {
			setIsUrlClicked(false);
		}, 3000);
	};

	const copyIssueId = async (): Promise<void> => {
		await navigator.clipboard.writeText(
			`${replaceSpacesWithDashes(title)}-${identifier}`,
		);
		setIsIdClicked(true);
		setTimeout(() => {
			setIsIdClicked(false);
		}, 3000);
	};

	const copyGitBranchName = async (): Promise<void> => {
		await navigator.clipboard.writeText(gitBranchName.trim());
		setIsBranchClicked(true);
		setTimeout(() => {
			setIsBranchClicked(false);
		}, 3000);
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.ctrlKey && event.shiftKey && event.key === ">") {
				event.preventDefault();
				copyGitBranchName();
			}
			if (event.ctrlKey && event.shiftKey && event.key === "<") {
				event.preventDefault();
				copyUrl();
			}
			if (event.ctrlKey && event.key === ".") {
				event.preventDefault();
				copyIssueId();
			}
		},
		[copyGitBranchName],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<div className="bg-popover h-10 text-muted-foreground rounded-lg min-w-[300px]">
			<div className="w-full px-5 h-full relative flex items-center justify-between">
				<div className="text-muted-foreground text-sm font-semibold w-24 pr-2">
					{identifier}
				</div>
				<div className="flex h-full items-center">
					<CopyTaskUrl copyUrl={copyUrl} />

					<CopyTaskId copyTaskId={copyIssueId} />
					<CopyGitBranchName copyGitBranchName={copyGitBranchName} />
				</div>
				<div
					className={`absolute left-0 top-[85vh] bg-popover w-full p-2 rounded border border-border transition-all delay-100 duration-1000 ${
						isUrlClicked ? "opacity-100" : "opacity-0"
					}`}
				>
					<p className="text-muted-foreground text-xs font-bold leading-6">
						Task {title} URL copied to clipboard
					</p>
					<p className="text-muted-foreground text-xs font-bold">
						Paste it wherever you like
					</p>
				</div>
				<div
					className={`absolute left-0 top-[85vh] bg-popover w-full p-2 rounded border border-border transition-all delay-100 duration-1000 ${
						isIdClicked ? "opacity-100" : "opacity-0"
					}`}
				>
					<p className="text-muted-foreground text-xs font-bold">
						{`${replaceSpacesWithDashes(title)}-${identifier}`} copied to
						clipboard
					</p>
					<p className="text-muted-foreground text-xs font-bold">
						Paste it wherever you like
					</p>
				</div>
				<div
					className={`absolute left-0 top-[85vh] bg-popover w-full p-2 rounded border border-border transition-all delay-100 duration-1000 ${
						isBranchClicked ? "opacity-100" : "opacity-0"
					}`}
				>
					<p className="text-muted-foreground text-xs font-bold">
						{gitBranchName} copied to clipboard
					</p>
					<p className="text-muted-foreground text-xs font-bold">
						Paste it wherever you like
					</p>
				</div>
			</div>
		</div>
	);
};

export default IssueSidebarTopRow;
