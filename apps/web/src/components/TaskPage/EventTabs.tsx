"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatedByInformation, UpdatedByInformation } from ".";
import TextEditor from "../TextEditor";
import { useCommentStore } from "@/store";
import CommentCard from "./CommentCard";

export const EventTabs = () => {
	const comments = useCommentStore((state) => state.comments);
	return (
		<Tabs defaultValue="activity" className="w-full mt-8">
			<TabsList className="grid w-1/2 grid-cols-2 bg-transparent">
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="comments">Comments</TabsTrigger>
			</TabsList>
			<TabsContent value="activity">
				<div className="flex flex-col bg-card rounded-md text-sm">
					<CreatedByInformation />
					<UpdatedByInformation />
				</div>
			</TabsContent>
			<TabsContent value="comments">
				{comments.map((comment) => {
					return <CommentCard key={comment.id} comment={comment} />;
				})}
				<TextEditor />
			</TabsContent>
		</Tabs>
	);
};
