"use client";

import type { CreateNotificationRequest } from "@/gen/rpc/event";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { client } from "@/lib/client";
import { useCommentStore, useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { getMentionsFromSlate } from "@/utils/textEditorSelection";
import { useOrganization } from "@clerk/nextjs";
import TextEditor, {
	type CustomDescendant,
	type CustomElement,
} from "@squaredmade/text-editor";
import { initialEditorValue } from "@squaredmade/text-editor";
import { convertSlateToMDX } from "@squaredmade/text-editor/format";
import { Button } from "@squaredmade/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@squaredmade/ui/tabs";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CreatedByInformation } from ".";
import CommentCard from "./CommentCard";

export const EventTabs = () => {
	const { comments, setComments } = useCommentStore((state) => state);
	const currentTask = useTaskStore((state) => state.currentTask);
	const [currentComment, setCurrentComment] =
		useState<CustomDescendant[]>(initialEditorValue);
	const { workspace } = useTaskDashboard();

	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});

	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
	);

	const { mutate: createMentionNotifications } = useMutation({
		mutationKey: ["notification", "createMention"],
		mutationFn: async ({
			editorContent,
		}: { editorContent: CustomDescendant[] }) => {
			if (!currentTask || !workspace) return;

			const mentions = getMentionsFromSlate(editorContent);

			for (const mention of mentions) {
				const mentionedUser = users?.find(
					(user) => user?.firstName === mention,
				);

				if (!mentionedUser || !mentionedUser.userId) continue;

				const mentionEvent: CreateNotificationRequest = {
					description: "Task Comment Mention",
					taskId: currentTask.id,
					type: "MENTIONED",
					userId: mentionedUser.userId,
					workspaceId: workspace.externalId,
				};
				await client.notification.createMention.$post(mentionEvent);
			}
		},
		onError: (error) => {
			toast.error("Error creating mention", {
				description: parseError(error),
			});
		},
	});

	const { mutate: addCommentToTask, isPending } = useMutation({
		mutationKey: ["comment", "addComment", currentTask?.id],
		mutationFn: async () => {
			if (currentTask) {
				const newComment = {
					comment: convertSlateToMDX(currentComment as CustomElement[]),
					date: new Date(),
					taskId: currentTask.id,
				};

				const response = await client.comment.addComment.$post(newComment);
				const createdComment = await response.json();

				setComments([...comments, createdComment]);
				setCurrentComment([]);
			} else {
				toast.error("Error getting comments", {
					description: "Could not find user data and current task",
				});
				throw new Error("Could not find user data and current task");
			}

			if (users && workspace) {
				createMentionNotifications({
					editorContent: currentComment,
				});
			} else {
				if (!users) console.error("No users found", users);
				if (!workspace) console.error("No workspace found", workspace);
				toast.error("Mentions could not be processed", {
					description:
						"Your comment was saved, but user mentions couldn't be processed",
				});
			}
		},
		onError: (error) => {
			toast.error("Error adding comment", {
				description: parseError(error),
			});
		},
	});
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
					<TextEditor value={currentComment} onChange={setCurrentComment} />
				)}
				<Button
					disabled={
						isPending ||
						currentComment.length === 0 ||
						currentComment === initialEditorValue
					}
					onClick={() => addCommentToTask()}
					className={`m-5 ml-auto ${(currentComment.length === 0 || currentComment === initialEditorValue) && "bg-muted text-muted-foreground hover:bg-muted"}`}
				>
					{isPending ? "Loading..." : "Confirm"}
				</Button>
			</TabsContent>
		</Tabs>
	);
};
