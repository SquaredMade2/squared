// import { format } from "date-fns";
// import CommentsTextEditor from "@/components/CommentsTextEditor";
// import type { Commit, Comment } from "@repo/db";
// import {
// 	useActivityStore,
// 	useAuthStore,
// 	useCommentStore,
// 	useTaskStore,
// 	useWorkspaceStore,
// } from "@/storeZ";

// const CommentForm = (): React.ReactElement => {
// 	const task = useTaskStore((state) => state.currentTask);
// 	const user = useAuthStore((state) => state.user);
// 	const comments = useCommentStore((state) => state.comments);

// 	const userId = user?.id ?? "";
// 	const taskId = task?.id ?? "";
// 	const userName = user?.name ?? "";

// 	function instanceOfCommit(object: Comment | Commit): object is Commit {
// 		return "committer" in object;
// 	}

// 	return (
// 		<>
// 			<div className="flex-col mdsm:w-full">
// 				<ul>
// 					{comments?.map((taskPageItem) => {
// 						if (instanceOfCommit(taskPageItem)) {
// 							const commit = taskPageItem;
// 							return (
// 								<div
// 									key={commit.id}
// 									className="flex flex-row resize-none mt-2.5 mb-2 mr-1 text-foreground border border-transparent "
// 								>
// 									<header className="text-muted-foreground mr-10">
// 										{" "}
// 										{format(new Date(commit.timestamp), "M/d/yy, h:mm a")}{" "}
// 									</header>
// 									<header className="mr-2">{commit.authorName}</header>
// 									<p className="text-muted-foreground">{commit.message}</p>
// 								</div>
// 							);
// 						}
// 						const comment = taskPageItem;
// 						return (
// 							<li key={comment.id}>
// 								<div className="relative flex flex-col">
// 									<div className="flex">
// 										<CommentsTextEditor
// 											placeholderText="Add a comment..."
// 											commentId={comment.id}
// 											authorId={comment.authorId}
// 											commentDate={comment.date.toLocaleDateString()}
// 											userId={userId}
// 											initialState={comment.comment}
// 											userName={userName}
// 										/>
// 									</div>
// 								</div>
// 							</li>
// 						);
// 					})}
// 				</ul>
// 				<div className="flex">
// 					<CommentsTextEditor
// 						placeholderText="Add a comment..."
// 						commentsTaskId={taskId as string}
// 						userId={userId}
// 						userName={userName}
// 					/>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default CommentForm;
