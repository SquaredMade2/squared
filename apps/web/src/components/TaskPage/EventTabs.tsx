"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CreateNotificationRequest } from "@/gen/rpc/event";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { client } from "@/lib/client";
import { useCommentStore, useTaskStore } from "@/store";
import { handleFormatSlateToComment } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";
import { getMentionsFromSlate } from "@/utils/textEditorSelection";
import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { CreatedByInformation } from ".";
import TextEditor, { type CustomDescendant } from "../TextEditor";
import { useToast } from "../ui/use-toast";
import CommentCard from "./CommentCard";

export const EventTabs = () => {
	const { comments, setComments } = useCommentStore((state) => state);
	const currentTask = useTaskStore((state) => state.currentTask);
	const { workspace } = useTaskDashboard();
	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});
	const { toast } = useToast();

	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
	);

	const handleAddComment = (editorContent: CustomDescendant[]) => {
		const { mutate: addCommentToTask } = useMutation({
			mutationKey: ["comment", "addComment", currentTask?.id],
			mutationFn: async () => {
				if (currentTask) {
					const newComment = {
						comment: handleFormatSlateToComment(editorContent),
						date: new Date(),
						taskId: currentTask.id,
					};
					setComments(
						await client.comment.addComment
							.$post(newComment)
							.then((res) => res.json()),
					);
					const mentions = getMentionsFromSlate(editorContent);

					if (currentTask && workspace && users) {
						for (let i = 0; i < mentions.length; i++) {
							const currentMentionUser = mentions[i];

							const mentionedUser = users.find(
								(user) => user.firstName === currentMentionUser,
							);

							if (!mentionedUser || !mentionedUser.userId) return;

							const mentionEvent: CreateNotificationRequest = {
								description: "Task Comment Mention",
								taskId: currentTask.id,
								type: "MENTIONED",
								userId: mentionedUser.userId,
								workspaceId: workspace.id,
							};
							client.notification.createMention.$post(mentionEvent);
						}
					} else {
						toast({
							title: "Workspace, Task, or User not found.",
							variant: "destructive",
						});
					}
				} else {
					toast({
						title: "Error getting comments",
						description: "Could not find user data and current task",
						variant: "destructive",
					});
				}
			},
			onError: (error) => {
				toast({
					title: "Error adding comment",
					description: parseError(error),
					variant: "destructive",
				});
			},
		});
		addCommentToTask();
	};

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
				{currentTask && (
					<TextEditor task={currentTask} addAction={handleAddComment} />
				)}
			</TabsContent>
		</Tabs>
	);
};
