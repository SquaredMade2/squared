import { useEffect } from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { getTaskComments } from "@/store/events/actions";
import CommentsTextEditor from "@/components/CommentsTextEditor";
import type { Commit, Comment } from "@repo/db";
import { getCommitsByRepo } from "@/store/taskData/thunks";

const CommentForm = (): React.ReactElement => {
	const dispatch = useAppDispatch();
	const taskId = useAppSelector((state) => state.singleTask?.data?._id);
	const userId = useAppSelector((state) => state.userSettings.user._id);

	const userName = useAppSelector((state) => state.userSettings.user.name);

	const currentRepo = useAppSelector(
		(state) => state.taskData.currentWorkspace.githubRepoInfoId,
	);

	const taskPageCommentData = useAppSelector((state) => {
		return state.events;
	});

	// An issues has been raised with this code. commits was returning undefined at runtime and crashing the app.
	//  https://linear.app/project-tasklist/issue/PRO-638/commits-variable-in-comments-component-returning-undefined

	// const commits = useAppSelector(
	// 	(state) => state.taskData.currentCommits
	// ).filter(() => {
	// 	return identifier;
	// });

	const commits =
		useAppSelector((state) => state.taskData.currentCommits) || [];

	function instanceOfCommit(object: Comment | Commit): object is Commit {
		return "committer" in object;
	}

	// const taskPageData = [[{date: new Date()}, {date:new Date()}], ...commits].sort((a, b) => {
	// 	let aDate = 0;
	// 	let bDate = 0;
	// 	if (instanceOfCommit(a)) {
	// 		aDate = new Date(a.timestamp).getTime();
	// 	} else {
	// 		aDate = new Date(a.date).getTime();
	// 	}
	// 	if (instanceOfCommit(b)) {
	// 		bDate = new Date(b.timestamp).getTime();
	// 	} else {
	// 		bDate = new Date(b.date).getTime();
	// 	}
	// 	return aDate > bDate ? 1 : -1;
	// });

	useEffect(() => {
		// dispatch(getTaskComments(taskId as string));
		if (currentRepo) {
			dispatch(getCommitsByRepo({ repoName: currentRepo, owner: currentRepo }));
		}
	}, [taskPageCommentData]);

	const comments = [] as Comment[];

	return (
		<>
			<div className="flex-col mdsm:w-full">
				<ul>
					{comments?.map((taskPageItem) => {
						if (instanceOfCommit(taskPageItem)) {
							const commit = taskPageItem;
							return (
								<div
									key={commit.id}
									className="flex flex-row resize-none mt-2.5 mb-2 mr-1 text-foreground border border-transparent "
								>
									<header className="text-muted-foreground mr-10">
										{" "}
										{format(new Date(commit.timestamp), "M/d/yy, h:mm a")}{" "}
									</header>
									<header className="mr-2">{commit.authorName}</header>
									<p className="text-muted-foreground">{commit.message}</p>
								</div>
							);
						}
						const comment = taskPageItem;
						return (
							<li key={comment.id}>
								<div className="relative flex flex-col">
									<div className="flex">
										<CommentsTextEditor
											placeholderText="Add a comment..."
											commentId={comment.id}
											authorId={comment.authorId}
											commentDate={comment.date.toLocaleDateString()}
											userId={userId}
											initialState={comment.comment}
											userName={userName}
										/>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
				<div className="flex">
					<CommentsTextEditor
						placeholderText="Add a comment..."
						commentsTaskId={taskId as string}
						userId={userId}
						userName={userName}
					/>
				</div>
			</div>
		</>
	);
};

export default CommentForm;
