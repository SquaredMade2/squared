"use client";

import type { CreateNotificationRequest } from "@/gen/rpc/event";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { client } from "@/lib/client";
import { useCommentStore, useTaskStore } from "@/store";
import { handleFormatSlateToComment } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";
import { getMentionsFromSlate } from "@/utils/textEditorSelection";
import { useOrganization } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@squaredmade/ui/tabs";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { CreatedByInformation } from ".";
import TextEditor, {
	type CustomDescendant,
	type CustomElement,
} from "../TextEditor";
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
				const mentionedUser = users?.find((user) => user.firstName === mention);

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

	const { mutate: addCommentToTask } = useMutation({
		mutationKey: ["comment", "addComment", currentTask?.id],
		mutationFn: async (editorContent: CustomDescendant[]) => {
			if (currentTask) {
				const newComment = {
					comment: handleFormatSlateToComment(editorContent as CustomElement[]),
					date: new Date(),
					taskId: currentTask.id,
				};

				const response = await client.comment.addComment.$post(newComment);
				const createdComment = await response.json();

				setComments([...comments, createdComment]);
			} else {
				toast.error("Error getting comments", {
					description: "Could not find user data and current task",
				});
				throw new Error("Could not find user data and current task");
			}

			if (users && workspace) {
				createMentionNotifications({
					editorContent,
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
				{currentTask && <TextEditor addAction={addCommentToTask} />}
			</TabsContent>
		</Tabs>
	);
};
