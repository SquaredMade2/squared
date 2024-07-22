import { useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { dueDateIcon } from '@/components/Svg';
import { setBackgroundColor } from '../DesignationsContainer';
import DateDropdown from '@/components/DateDropdown';
import type { RootState } from '@/store';
import format from 'date-fns/format';

const styles = {
  newIssueContainer: 'relative',
  issueSidebarContainer: 'relative flex flex-row flex-wrap',
  svg: 'w-4 cursor-pointer',
  buttonNewIssue:
    'inline-flex items-center border border-border rounded px-2 py-0.5 mr-3 text-popover-foreground text-sm shadow-md cursor-pointer',
  buttonSidebar:
    'inline-flex items-center border border-border hover:border-border rounded-3xl px-3 py-1 m-1 text-sm cursor-pointer',
  defaultText: 'text-sm font-semibold text-popover-foreground ml-2 cursor-pointer',
};

const DateButton = ({ location }: { location: string }) => {
  const newIssueDate = useAppSelector((state: RootState) => state.taskData.dueDate);
  const sidebarDate: Date | undefined = useAppSelector((state) => {
    if (location === 'issueSidebar') {
      return state.singleTask.data?.dueDate;
    }
    return undefined;
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme } = useAppSelector((state) => state.userSettings);

  const handleBackground = () => {
    return theme === 'light' ? 'bg-popover hover:bg-muted' : 'bg-muted hover:bg-popover';
  };

  const newIssueButton = () => {
    return (
      <button
        type="button"
        className={`${styles.buttonNewIssue} ${handleBackground()}`}
        onClick={handleButtonClick}
      >
        <span className={styles.svg}>{dueDateIcon()}</span>
        <span className={styles.defaultText}>
          {newIssueDate ? format(new Date(newIssueDate), 'M/d/yy') : 'Due Date'}
        </span>
      </button>
    );
  };

  const issueSidebarButton = () => {
    return (
      <button
        type="button"
        className={`${styles.buttonSidebar} ${setBackgroundColor(theme)}`}
        onClick={handleButtonClick}
      >
        <span className={styles.svg}>{dueDateIcon()}</span>
        <span className={styles.defaultText}>
          {sidebarDate ? format(new Date(sidebarDate), 'M/d/yy') : 'No Date Set'}
        </span>
      </button>
    );
  };

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickAway = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div
        className={
          location === 'newIssue' ? styles.newIssueContainer : styles.issueSidebarContainer
        }
      >
        {location === 'newIssue' && newIssueButton()}
        {location === 'issueSidebar' && issueSidebarButton()}
        {showDropdown && (
          <DateDropdown
            location={location}
            handleButtonClick={handleButtonClick}
            handleClickAway={handleClickAway}
          />
        )}
      </div>
    </>
  );
};

export default DateButton;
