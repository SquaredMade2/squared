"use client";

import TopNavBar from "@/components/TopNavBar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTaskStore, useViewStore } from "@/store";
import { useUser } from "@clerk/nextjs";
import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import type { Workspace } from "@squared/db";
import { Clipboard } from "@squared/icons";
import type { ReactNode } from "react";
import SquaredLoader from "../Loaders/SquaredLoader";
import { NoTasksNewTaskButton } from "../Modals";

interface TaskPageLayoutProps {
	loading: boolean;
	authorized: boolean;
	currentWorkspace: Workspace;
	teamIdentifier: string;
	handleDragEnd: OnDragEndResponder;
	pageTitle?: string;
	children: ReactNode;
}

export function TaskPageLayout({
	loading,
	authorized,
	currentWorkspace,
	teamIdentifier,
	handleDragEnd,
	pageTitle,
	children,
}: TaskPageLayoutProps) {
	const { view } = useViewStore((state) => state);
	const { user } = useUser();
	const { tasks } = useTaskStore((state) => state);

	if (loading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<SquaredLoader />
			</div>
		);
	}

	return (
		<div className="flex h-screen w-full flex-col overflow-hidden">
			<div className="w-full px-2 sm:px-5">
				<TopNavBar pageTitle={pageTitle} />
			</div>
			{!authorized ? (
				<div className="flex h-full w-screen flex-col items-center bg-background">
					<div className="flex h-full w-full flex-col items-center justify-center text-foreground">
						<h1 className="text-2xl">Not Authorized</h1>
						<p>
							You are not authorized to access team with identifier{" "}
							{`"${teamIdentifier}"`}
						</p>
					</div>
				</div>
			) : user && tasks.length === 0 ? (
				<div className="flex h-full w-full flex-col items-center justify-center gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
						<Clipboard className="h-8 w-8 text-muted-foreground" />
					</div>
					<h1 className="font-bold text-2xl">No tasks yet</h1>
					<p className="text-accent-foreground">
						You haven't created any tasks. Start by adding a new task to your
						dashboard.
					</p>
					<NoTasksNewTaskButton />
				</div>
			) : currentWorkspace ? (
				<div className="flex-grow overflow-hidden">
					<ScrollArea
						className={`${
							view === "list"
								? "h-[calc(100vh-145px)] overflow-y-auto"
								: "h-[calc(100vh-55px)] overflow-x-auto"
						} px-2`}
					>
						<div
							className={`mx-2 flex ${
								view === "grid" ? "flex-nowrap" : "flex-wrap"
							}`}
						>
							<DragDropContext onDragEnd={handleDragEnd}>
								{children}
							</DragDropContext>
						</div>
						{view === "grid" && <ScrollBar orientation="horizontal" />}
					</ScrollArea>
				</div>
			) : (
				<div className="flex h-full w-screen flex-col items-center bg-background">
					<div className="flex h-full w-full flex-col items-center justify-center text-foreground">
						<h1 className="text-2xl">Team not found</h1>
						<p>There is no team with identifier {`"${teamIdentifier}"`}</p>
					</div>
				</div>
			)}
		</div>
	);
}
