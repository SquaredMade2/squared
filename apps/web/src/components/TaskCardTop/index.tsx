import Link from 'next/link';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { rightChevron } from '@/components/Svg';
import type { RootState } from '@/store';
import WorkspaceInitials from '@/components/WorkspaceImage';

const styles = {
  buttonActive:
    'w-7 h-6 bg-linearPurple-400 flex justify-center items-center rounded border border-gray-500 box-border hover:bg-background mx-1',
  flex: 'flex',
  homeContainer: 'w-full whitespace-nowrap flex items-center gap-2 text-foreground',
  workspaceUrl: 'flex items-center text-muted-foreground hover:text-foreground',
  teamIcon: 'mt-0.5 rounded',
  rightChevron: 'mt-0.5',
  svg: 'flex items-center justify-center px-2 py-2 text-xs xs:hidden sm:hidden md:block rounded hover:bg-accent group',
  svgFill: 'fill-gray-500',
  taskTitle: 'w-full truncate',
  topBg: 'h-10 flex',
  viewButton:
    'w-1/2 h-6 bg-background flex justify-center items-center rounded-sm box-border hover:bg-card',
};

const TaskCardTop = () => {
  const workspace = useAppSelector((state: RootState) => state.taskData.currentWorkspace);
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);

  const index: number = allWorkspaces.findIndex((item) => item._id === workspace._id);

  const taskTitle = useAppSelector((state) => state.singleTask.data?.title);

  return (
    <>
      <div className={styles.topBg}>
        <div className={styles.homeContainer}>
          <Link className={styles.workspaceUrl} href={`/workspace/${workspace.url}`}>
            <div className={styles.teamIcon}>
              <WorkspaceInitials
                workspaceName={workspace.name}
                backgroundColor={index}
                location="workspaceMenu"
              />
            </div>
            <p>{workspace.url}</p>
          </Link>
          <span className={styles.rightChevron}>{rightChevron()}</span>
          <div className={styles.taskTitle}>{taskTitle}</div>
        </div>
      </div>
    </>
  );
};

export default TaskCardTop;
