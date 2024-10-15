import { useCallback, useEffect } from "react";
import { formatUrl, sanitizeBranchName } from "@/utils/formatting";
import { useToast } from "../ui/use-toast";
import type { Task } from "@repo/db";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Copy, GitPullRequestArrow, Link } from "lucide-react";

export const TaskSidebarTopRow = ({
	task,
	workspaceUrl,
}: { task: Task; workspaceUrl?: string }) => {
	const { toast } = useToast();

	const identifier = task.identifier;
	const title = task.title;

	const TaskUrl = `${process.env.NEXT_PUBLIC_URL}/${workspaceUrl}/task/${identifier}/${formatUrl(title)}`;
	const gitBranchName = `
			${sanitizeBranchName(
				`${title.toLowerCase()}-${String(identifier).toLowerCase()}`,
			)}`;

	const copyUrl = async (): Promise<void> => {
		await window.navigator.clipboard.writeText(TaskUrl);
		toast({
			title: "Task link copied to clipboard",
			description: "Paste it wherever you like",
		});
	};

	const copyTaskId = async (): Promise<void> => {
		await navigator.clipboard.writeText(identifier);
		toast({
			title: `${identifier} copied to clipboard`,
			description: "Paste it wherever you like",
		});
	};

	const copyGitBranchName = async (): Promise<void> => {
		await navigator.clipboard.writeText(gitBranchName.trim());
		toast({
			title: `${gitBranchName} copied to clipboard`,
			description: "Paste it wherever you like",
		});
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
				copyTaskId();
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
		<div className="w-full px-5 relative flex items-center justify-between bg-popover h-10 text-muted-foreground rounded-lg min-w-[300px]">
			<div className="text-muted-foreground text-sm font-semibold w-24 pr-2">
				{identifier}
			</div>
			<div className="flex h-full items-center">
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Copy Task URL"
								onClick={copyUrl}
							>
								<Link className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="flex gap-4 items-center">
							<span className="text-xs">Copy Task URL</span>
							<div className="flex gap-1">
								<KeyboardShortcut>Ctrl</KeyboardShortcut>
								<KeyboardShortcut>Shift</KeyboardShortcut>
								<KeyboardShortcut>,</KeyboardShortcut>
							</div>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Copy Task ID"
								onClick={copyTaskId}
							>
								<Copy className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="flex gap-4 items-center">
							<span className="text-xs">Copy Task ID</span>
							<div className="flex gap-1">
								<KeyboardShortcut>Ctrl</KeyboardShortcut>
								<KeyboardShortcut>.</KeyboardShortcut>
							</div>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Copy Git Branch Name"
								onClick={copyGitBranchName}
							>
								<GitPullRequestArrow className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="flex gap-4 items-center">
							<span className="text-xs">Copy Git Branch Name</span>
							<div className="flex gap-1">
								<KeyboardShortcut>Ctrl</KeyboardShortcut>
								<KeyboardShortcut>Shift</KeyboardShortcut>
								<KeyboardShortcut>.</KeyboardShortcut>
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

const KeyboardShortcut = ({ children }: { children: React.ReactNode }) => {
	return <span className="flex border px-1 rounded">{children}</span>;
};
