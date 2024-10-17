"use client";

import type { ReactNode } from "react";
import TopNavBar from "@/components/TopNavBar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clipboard } from "lucide-react";
import { useAuthStore, useTaskStore, useViewStore } from "@/store";
import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import type { Workspace } from "@repo/db";
import { NoTasksNewIssueButton } from "../Modals";
import SquaredLoader from "../Loaders/SquaredLoader";

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
	const { user } = useAuthStore((state) => state);
	const { tasks } = useTaskStore((state) => state);

	if (loading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<SquaredLoader />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col h-screen overflow-hidden">
			<div className="w-full px-2 sm:px-5">
				<TopNavBar pageTitle={pageTitle} />
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
					<NoTasksNewIssueButton />
				</div>
			) : currentWorkspace ? (
				<div className="flex-grow overflow-hidden">
					<ScrollArea
						className={`${
							view === "list"
								? "overflow-y-auto h-[calc(100vh-145px)]"
								: "overflow-x-auto h-[calc(100vh-55px)]"
						} px-2`}
					>
						<div
							className={`flex mx-2 ${
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
