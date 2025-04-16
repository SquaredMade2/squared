import DeleteTaskPopOver from "@/components/DeleteTaskPopOver";
import { useTaskStore } from "@/store";
import { formatUrl, sanitizeBranchName } from "@/utils/formatting";
import { useOrganization } from "@clerk/nextjs";
import { Copy, GitPullRequestArrow, Link } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@squaredmade/ui/tooltip";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export const TaskSidebarTopRow = () => {
	const task = useTaskStore((state) => state.currentTask);
	const { organization } = useOrganization();

	const identifier = task?.identifier ?? "";
	const title = task?.title ?? "";

	const TaskUrl = `${process.env.NEXT_PUBLIC_URL}/${organization?.slug}/task/${identifier}/${formatUrl(title)}`;
	const gitBranchName = `${sanitizeBranchName(title.toLowerCase())}-${String(identifier).toLowerCase()}`;

	const copyUrl = async (): Promise<void> => {
		await window.navigator.clipboard.writeText(TaskUrl);
		toast.success("Task link copied to clipboard", {
			description: "Paste it wherever you like",
		});
	};

	const copyTaskId = async (): Promise<void> => {
		await navigator.clipboard.writeText(identifier);
		toast.success(`${identifier} copied to clipboard`, {
			description: "Paste it wherever you like",
		});
	};

	const copyGitBranchName = async (): Promise<void> => {
		await navigator.clipboard.writeText(gitBranchName.trim());
		toast.success(`${gitBranchName} copied to clipboard`, {
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
		<div className="relative flex h-10 w-full min-w-[300px] items-center justify-between rounded-lg bg-popover px-5 text-muted-foreground">
			<div className="w-24 pr-2 font-semibold text-muted-foreground text-sm">
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
						<TooltipContent className="flex items-center gap-4">
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
						<TooltipContent className="flex items-center gap-4">
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
						<TooltipContent className="flex items-center gap-4">
							<span className="text-xs">Copy Git Branch Name</span>
							<div className="flex gap-1">
								<KeyboardShortcut>Ctrl</KeyboardShortcut>
								<KeyboardShortcut>Shift</KeyboardShortcut>
								<KeyboardShortcut>.</KeyboardShortcut>
							</div>
						</TooltipContent>
					</Tooltip>
					{task && <DeleteTaskPopOver task={task} />}
				</TooltipProvider>
			</div>
		</div>
	);
};

const KeyboardShortcut = ({ children }: { children: React.ReactNode }) => {
	return <span className="flex rounded border px-1">{children}</span>;
};
