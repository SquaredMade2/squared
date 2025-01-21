"use client";

import { useCommentStore, useTaskStore } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@squaredmade/ui/tabs";
import { CreatedByInformation } from ".";
import TextEditor from "../TextEditor";
import CommentCard from "./CommentCard";

export const EventTabs = () => {
	const comments = useCommentStore((state) => state.comments);
	const currentTask = useTaskStore((state) => state.currentTask);

	return (
		<Tabs defaultValue="activity" className="w-full mt-8">
			<TabsList className="grid w-1/2 grid-cols-2 bg-transparent">
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="comments">Comments</TabsTrigger>
			</TabsList>
			<TabsContent value="activity">
				<div className="flex flex-col bg-card rounded-md text-sm py-2">
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
