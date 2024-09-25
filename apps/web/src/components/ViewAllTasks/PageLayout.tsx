import type { ReactNode } from "react";
import TopNavBar from "@/components/TopNavBar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2, Clipboard } from "lucide-react";
import { useAuthStore, useTaskStore, useViewStore } from "@/store";
import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import type { Workspace } from "@repo/db";
import { Button } from "../ui/button";

interface TaskPageLayoutProps {
	loading: boolean;
	authorized: boolean;
	currentWorkspace: Workspace;
	teamIdentifier: string;
	handleDragEnd: OnDragEndResponder;
	children: ReactNode;
}

export function TaskPageLayout({
	loading,
	authorized,
	currentWorkspace,
	teamIdentifier,
	handleDragEnd,
	children,
}: TaskPageLayoutProps) {
	const { view } = useViewStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { tasks } = useTaskStore((state) => state);

	if (loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Loader2 className="animate-spin size-12" />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col h-screen overflow-hidden">
			<div className="w-full px-2 sm:px-5">
				<TopNavBar />
			</div>
			{!authorized ? (
				<div className="flex items-center flex-col w-screen h-full bg-background">
					<div className="w-full h-full flex flex-col items-center justify-center text-foreground">
						<h1 className="text-2xl">Not Authorized</h1>
						<p>
							You are not authorized to access team with identifier{" "}
							{`"${teamIdentifier}"`}
						</p>
					</div>
				</div>
			) : user && tasks.length === 0 ? (
				<div className="w-full h-full flex flex-col items-center justify-center gap-4">
					<div className="w-16 h-16 flex justify-center items-center bg-secondary rounded-full">
						<Clipboard className="w-8 h-8 text-muted-foreground" />
					</div>
					<h1 className="text-2xl font-bold">No tasks yet</h1>
					<p className="text-accent-foreground">
						You haven't created any tasks. Start by adding a new task to your
						dashboard.
					</p>
					<Button variant="secondary">+ Add your first task</Button>
				</div>
			) : currentWorkspace ? (
				<ScrollArea
					className={`${
						view === "list" ? "max-h-[calc(100vh-55px)]" : ""
					} px-2`}
				>
					<div className={"flex flex-grow mx-2"}>
						<DragDropContext onDragEnd={handleDragEnd}>
							{children}
						</DragDropContext>
						{view === "grid" && <ScrollBar orientation="horizontal" />}
					</div>
				</ScrollArea>
			) : (
				<div className="flex items-center flex-col w-screen h-full bg-background">
					<div className="w-full h-full flex flex-col items-center justify-center text-foreground">
						<h1 className="text-2xl">Team not found</h1>
						<p>There is no team with identifier {`"${teamIdentifier}"`}</p>
					</div>
				</div>
			)}
		</div>
	);
}
