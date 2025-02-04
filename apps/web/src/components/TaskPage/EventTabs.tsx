"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommentStore, useTaskStore } from "@/store";
import { CreatedByInformation } from ".";
import TextEditor from "../TextEditor";
import CommentCard from "./CommentCard";

export const EventTabs = () => {
	const comments = useCommentStore((state) => state.comments);
	const currentTask = useTaskStore((state) => state.currentTask);

	return (
		<Tabs defaultValue="activity" className="mt-8 w-full">
			<TabsList className="grid w-1/2 grid-cols-2 bg-transparent">
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="comments">Comments</TabsTrigger>
			</TabsList>
			<TabsContent value="activity">
				<div className="flex flex-col rounded-md bg-card py-2 text-sm">
					<CreatedByInformation />
				</div>
			</TabsContent>
			<TabsContent value="comments">
				{comments.map((comment) => {
					return <CommentCard key={comment.id} comment={comment} />;
				})}
				{currentTask && <TextEditor task={currentTask} />}
			</TabsContent>
		</Tabs>
	);
};
