"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatedByInformation, UpdatedByInformation } from ".";
import TextEditor from "../TextEditor";
import { useCommentStore } from "@/store";
import CommentCard from "./CommentCard";
import { useEffect } from "react";
import { toast } from "../ui/use-toast";
import { useTaskPageData } from "@/hooks/useTaskPageData";

export const EventTabs = () => {
	const comments = useCommentStore((state) => state.comments);
	const getComments = useCommentStore((state) => state.getAllComments);
	const { task } = useTaskPageData();

	useEffect(() => {
		const fetchTaskComments = async () => {
			try {
				if (task) {
					await getComments(task.id);
				}
			} catch (err) {
				toast({
					title: "Error getting comments",
					description: String(err),
					variant: "destructive",
				});
			}
		};
		fetchTaskComments();
	}, [task]);
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
