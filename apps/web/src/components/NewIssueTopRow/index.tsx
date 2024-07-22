import NewIssueCloseButton from '@/components/NewIssueCloseButton';
import { useSelector } from 'react-redux';
import { backChevron, project } from '@/components/Svg';
import type { Team } from '@/store/taskData/taskData.interfaces';
import type { UserSettingsState } from '@/store/userSettings/userSettings.interfaces';
import type { NewIssueTopRowProps } from './NewIssueTopRow.interfaces';

const styles = {
  container: 'flex flex-row items-center justify-between text-sm w-full px-3 pt-3 pb-1.5',
  leftSide: 'flex flex-row items-center',
  project:
    'flex flex-row items-center text-muted-foreground text-small border border-border rounded-md shadow-md px-2 py-0.5',
  projectSvg: 'pl-1 mr-1',
  rightSide: 'flex flex-row items-center',
  svg: 'rotate-180 h-2 w-2 opacity-50 ml-2 mr-1.5 mt-1',
  projectText: 'text-xs',
  newIssueText: 'text-xs',
};

const NewIssueTopRow = ({
  showCloseModal,
  handleCloseClick,
  handleCancelClose,
  handleDiscard,
}: NewIssueTopRowProps) => {
  const { theme } = useSelector((state: UserSettingsState) => state);
  const { identifier } = useSelector((state: Team) => state);
  const handleBackground = () => `bg-popover${theme === 'light' ? '' : 'Hover'}`;

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={`${styles.project} ${handleBackground()}`}>
          <div className={styles.projectSvg}>{project()}</div>
          <div className={styles.projectText}>{identifier}</div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.svg}>{backChevron()}</div>
          <div className={styles.newIssueText}>New Issue</div>
        </div>
      </div>
      <div className={styles.rightSide}>
        <NewIssueCloseButton
          showCloseModal={showCloseModal}
          handleCloseClick={handleCloseClick}
          handleCancelClose={handleCancelClose}
          handleDiscard={handleDiscard}
        />
      </div>
    </div>
  );
};

export default NewIssueTopRow;
