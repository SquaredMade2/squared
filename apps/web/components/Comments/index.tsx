import { useEffect } from 'react';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { getTaskComments } from '@/store/events/actions';
import CommentsTextEditor from '@/components/CommentsTextEditor';
import type { Comment } from '@/components/Comments/Comments.interfaces';
import type { Commits } from '@/store/taskData/taskData.interfaces';
import { getCommitsByRepo } from '@/store/taskData/thunks';

const styles = {
  mainContainer: 'flex-col mdsm:w-full',
  commentContainer: 'relative flex flex-col',
  formContainerNoComment: 'relative',
  individualComment: 'flex',
  commits: 'flex flex-row resize-none mt-2.5 mb-2 mr-1 text-foreground border border-transparent ',
  commitDate: 'text-muted-foreground mr-10',
  commitAuthor: 'mr-2',
  commitMessage: 'text-muted-foreground',
};

const CommentForm = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const taskId = useAppSelector((state) => state.singleTask?.data?._id);
  const userId = useAppSelector((state) => state.userSettings.user._id);

  const userName = useAppSelector((state) => state.userSettings.user.name);

  const currentRepo = useAppSelector((state) => state.taskData.currentWorkspace.githubRepoInfo);

  const taskPageCommentData = useAppSelector((state) => {
    return state.events.taskPageCommentData;
  });

  // An issues has been raised with this code. commits was returning undefined at runtime and crashing the app.
  //  https://linear.app/project-tasklist/issue/PRO-638/commits-variable-in-comments-component-returning-undefined

  // const commits = useAppSelector(
  // 	(state) => state.taskData.currentCommits
  // ).filter(() => {
  // 	return identifier;
  // });

  const commits = useAppSelector((state) => state.taskData.currentCommits) || [];

  function instanceOfCommit(object: Comment | Commits): object is Commits {
    return 'committer' in object;
  }

  const taskPageData = [...taskPageCommentData, ...commits].sort((a, b) => {
    let aDate = 0;
    let bDate = 0;
    if (instanceOfCommit(a)) {
      aDate = new Date(a.timestamp).getTime();
    } else {
      aDate = new Date(a.date).getTime();
    }
    if (instanceOfCommit(b)) {
      bDate = new Date(b.timestamp).getTime();
    } else {
      bDate = new Date(b.date).getTime();
    }
    return aDate > bDate ? 1 : -1;
  });

  useEffect(() => {
    dispatch(getTaskComments(taskId as string));
    if (currentRepo) {
      dispatch(getCommitsByRepo(currentRepo));
    }
  }, [taskPageCommentData.length]);

  return (
    <>
      <div className={styles.mainContainer}>
        <ul>
          {taskPageData.map((taskPageItem) => {
            if (instanceOfCommit(taskPageItem)) {
              const commit = taskPageItem;
              return (
                <div key={commit.id} className={styles.commits}>
                  <header className={styles.commitDate}>
                    {' '}
                    {format(new Date(commit.timestamp), 'M/d/yy, h:mm a')}{' '}
                  </header>
                  <header className={styles.commitAuthor}>{commit.author.name}</header>
                  <p className={styles.commitMessage}>{commit.message}</p>
                </div>
              );
            }
            const comment = taskPageItem;
            return (
              <li key={comment._id}>
                <div className={styles.commentContainer}>
                  <div className={styles.individualComment}>
                    <CommentsTextEditor
                      placeholderText="Add a comment..."
                      commentId={comment._id}
                      authorId={comment.author}
                      commentDate={comment.date}
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
        <div className={styles.individualComment}>
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
