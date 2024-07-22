import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { handleWorkspaceNameOverflow } from '@/utils/formatting';
import { close, rightChevron } from '@/components/Svg';
import WorkspaceInitials from '@/components/WorkspaceImage';
import type { ViewNewTopNavBarProps } from '@/components/ViewNewTopNavBar/ViewNewTopNavBar.interfaces';

const styles = {
  header: 'max-w-screen',
  container: 'bg-background mt-5 flex flex-row w-full items-center space-x-4',
  workspace: 'flex flex-row items-center rounded-lg text-white',
  newViewText: 'text-gray-300',
};

const ViewNewTopNavBar = ({ showFilterSaveForm }: ViewNewTopNavBarProps) => {
  const allWorkspaces = useSelector((state: RootState) => state.taskData.workspaces);
  const currentWorkspace = useSelector((state: RootState) => state.taskData.currentWorkspace);
  const index: number = allWorkspaces.findIndex((item) => item._id === currentWorkspace._id);

  return (
    <div className={styles.header}>
      <p>navbar</p>
      {!showFilterSaveForm && (
        <div className={styles.container}>
          <Link href="/views">{close()}</Link>
          <div className={styles.workspace}>
            <WorkspaceInitials
              workspaceName={currentWorkspace.name}
              backgroundColor={index}
              location="workspaceMenu"
            />
            {handleWorkspaceNameOverflow(currentWorkspace.name)}
          </div>
          <div>{rightChevron()}</div>
          <Link href="/views">
            <div className={styles.newViewText}>Views</div>
          </Link>
          <div>{rightChevron()}</div>
          <div className={styles.newViewText}>New View</div>
        </div>
      )}
    </div>
  );
};

export default ViewNewTopNavBar;
