import { useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import StatusDropdown from '@/components/StatusDropdown';
import { setBackgroundColor } from '../DesignationsContainer';
import { backlog, todo, inProgress, done, canceled, duplicate } from '@/components/Svg';
import type { StatusButtonProps } from './StatusButton.interfaces';

const styles = {
  newIssueContainer: 'relative',
  issueSidebarContainer: 'relative mr-12',
  svg: 'hover:bg-nav-hover w-4 h-4 mr-2 cursor-pointer',
  buttonNewIssue:
    'inline-flex items-center h-7  border-[0.8px] border border-border rounded px-2 py-0.5 mr-2 text-card-foreground text-sm shadow-md cursor-pointer',
  buttonSidebar:
    'grow flex flex-row w-36 items-center border-[0.8px] border border-transparent hover:border-border rounded px-2 py-2 mr-2 text-card-foreground text-sm cursor-pointer',
  text: 'text-sm font-semibold text-card-foreground ml-1 cursor-pointer',
};

const StatusButton = ({ location }: StatusButtonProps) => {
  const newIssueStatus = useAppSelector((state) => state.taskData.status);
  const sidebarStatus: string | undefined = useAppSelector(
    (state) => state.singleTask.data?.status,
  );
  const { theme } = useAppSelector((state) => state.userSettings);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickAway = () => {
    setShowDropdown(!showDropdown);
  };

  const handleBackground = () => {
    return theme === 'light'
      ? 'bg-popover hover:bg-popoverHover'
      : 'bg-popoverHover hover:bg-popover';
  };

  const showIcon = (name: string | undefined) => {
    switch (name) {
      case 'Backlog':
        return backlog();
      case 'Todo':
        return todo();
      case 'In Progress':
        return inProgress();
      case 'Done':
        return done();
      case 'Canceled':
        return canceled();
      case 'Duplicate':
        return duplicate();
    }
  };

  const newIssueButton = () => {
    return (
      <button
        type="button"
        className={`${styles.buttonNewIssue} ${handleBackground()}`}
        onClick={handleButtonClick}
      >
        <span className={styles.svg}>{showIcon(newIssueStatus)}</span>
        <span className={styles.text}>{newIssueStatus}</span>
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
        <span className={styles.svg}>{showIcon(sidebarStatus)}</span>
        <span className={styles.text}>{sidebarStatus}</span>
      </button>
    );
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
          <StatusDropdown
            handleButtonClick={handleButtonClick}
            showIcon={showIcon}
            location={location}
            handleClickAway={handleClickAway}
          />
        )}
      </div>
    </>
  );
};

export default StatusButton;
