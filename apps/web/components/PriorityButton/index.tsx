import { type ReactElement, useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { noPriority, urgent, high, medium, low } from '@/components/Svg';
import PriorityDropdown from '@/components/PriorityDropdown';
import { setBackgroundColor } from '../DesignationsContainer';
import type { PriorityButtonProps } from './PriorityButton.interfaces';

const PriorityButton = ({ location }: PriorityButtonProps) => {
  const styles = {
    newIssueContainer: 'relative flex items-center',
    issueSidebarContainer: 'relative grow mr-12',
    svg: ' w-4 h-4 cursor-pointer',
    text: 'text-sm flex  font-semibold text-card-foreground cursor-pointer ml-3',
    smallButton: 'border border-[0.8px] border-border rounded py-1 px-0.5 mr-2 cursor-pointer',
    buttonNewIssue:
      'flex cursor-pointer items-center h-7 justify-center w-[60px] border-[0.8px] border border-border rounded px-2 py-0.5 mr-2 text-card-foreground text-sm shadow-md cursor-pointer',
    buttonSidebar:
      'grow flex flex-row w-36 items-center border-[0.8px] border border-transparent hover:border-border rounded px-2 py-2 mr-2 text-card-foreground text-sm cursor-pointer',
  };

  const newIssuePriority = useAppSelector((state) => state.taskData.priority);
  const sidebarPriority: string | undefined = useAppSelector((state) => {
    if (location === 'issueSidebar') {
      return state.singleTask.data?.priority;
    }
    return undefined;
  });
  const labelsSelected = useAppSelector((state) => state.taskData.labels);
  const { theme } = useAppSelector((state) => state.userSettings);

  const handleBackground = () => {
    return theme === 'light'
      ? 'bg-popover hover:bg-popoverHover'
      : 'bg-popoverHover hover:bg-popover';
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const newIssueButton = (): ReactElement => {
    return (
      <button
        type="button"
        className={
          labelsSelected?.length > 0 && !newIssuePriority // added optional chaining i.e ? -- comment for Ed
            ? `${styles.smallButton} ${handleBackground()}`
            : `${styles.buttonNewIssue} ${handleBackground()}`
        }
        onClick={handleButtonClick}
      >
        <div className={styles.svg}>
          {newIssuePriority ? showIcon(newIssuePriority) : noPriority()}
        </div>
        {labelsSelected?.length === 0 && ( // added optional chaining i.e ? -- comment for Ed
          <span className={styles.text}>
            {newIssuePriority !== null &&
              (newIssuePriority.length > 0 ? newIssuePriority : 'Priority')}
          </span>
        )}
        {labelsSelected?.length === 0 && ( // added optional chaining i.e ? -- comment for Ed
          <span className={styles.text}>{newIssuePriority == null ? 'Priority' : ''}</span>
        )}
        {labelsSelected?.length > 0 && newIssuePriority && (
          <span className={styles.text}>{newIssuePriority}</span>
        )}
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
        <span className={styles.svg}>
          {sidebarPriority ? showIcon(sidebarPriority) : noPriority()}
        </span>
        <span className={styles.text}>{sidebarPriority ? sidebarPriority : 'No priority'}</span>
      </button>
    );
  };

  const handleButtonClick = (): void => {
    setShowDropdown(!showDropdown);
  };

  const handleClickAway = (): void => {
    setShowDropdown(!showDropdown);
  };

  const showIcon = (name: string): JSX.Element => {
    switch (name) {
      case 'No priority':
        return noPriority();
      case 'Urgent':
        return urgent();
      case 'High':
        return high();
      case 'Medium':
        return medium();
      case 'Low':
        return low();
    }
    return noPriority();
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
          <PriorityDropdown
            location={location}
            handleButtonClick={handleButtonClick}
            showIcon={showIcon}
            handleClickAway={handleClickAway}
          />
        )}
      </div>
    </>
  );
};

export default PriorityButton;
