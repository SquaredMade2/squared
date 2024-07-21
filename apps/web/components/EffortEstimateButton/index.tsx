import { type ReactElement, useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import EffortEstimateDropdown from '@/components/EffortEstimateDropdown';
import { high, medium, low } from '@/components/Svg';
import { setBackgroundColor } from '../DesignationsContainer';
import type { EffortEstimateButtonProps } from './EffortEstimateButton.interfaces';

const EffortEstimateButton = ({ location }: EffortEstimateButtonProps) => {
  const styles = {
    newIssueContainer: 'relative flex items-center',
    issueSidebarContainer: 'relative grow mr-12',
    svg: 'w-4 h-4 mr-2 inline-block cursor-pointer',
    text: 'text-sm flex font-semibold text-foreground cursor-pointer',
    smallButton:
      'flex cursor-pointer items-center border border-[0.8px] border-border rounded py-1 px-2 mr-2 h-7 shadow-md',
    buttonNewIssue:
      'flex cursor-pointer items-center justify-center border-[0.8px] border border-border rounded py-1 px-2 mr-2 h-7 text-foreground text-sm shadow-md',
    buttonSidebar:
      'grow flex flex-row items-center border-[0.8px] border border-transparent hover:border-border rounded px-2 py-2 mr-2 text-foreground text-sm',
  };
  const newIssueEffortEstimate = useAppSelector((state) => state.taskData.effortEstimate);
  const sidebarEffortEstimate: number | undefined = useAppSelector((state) => {
    if (location === 'issueSidebar') {
      return state.singleTask.data?.effortEstimate;
    }
    return undefined;
  });
  const { theme } = useAppSelector((state) => state.userSettings);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBackground = () => {
    return theme === 'light'
      ? 'bg-popover hover:bg-popoverHover'
      : 'bg-popoverHover hover:bg-popover';
  };

  const newIssueButton = (): ReactElement => {
    return (
      <button
        type="button"
        className={
          !newIssueEffortEstimate
            ? `${styles.smallButton} ${handleBackground()}`
            : `${styles.buttonNewIssue} ${handleBackground()}`
        }
        onClick={handleButtonClick}
      >
        <span className={styles.svg}>
          {newIssueEffortEstimate ? showIcon(newIssueEffortEstimate) : medium()}
        </span>
        <span className={styles.text}>{newIssueEffortEstimate || 'Effort'}</span>
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
          {sidebarEffortEstimate ? showIcon(sidebarEffortEstimate) : medium()}
        </span>
        <span className={styles.text}>{sidebarEffortEstimate || 'Effort'}</span>
      </button>
    );
  };

  const handleButtonClick = (): void => {
    setShowDropdown(!showDropdown);
  };

  const handleClickAway = (): void => {
    setShowDropdown(!showDropdown);
  };

  const showIcon = (estimate: number): JSX.Element => {
    switch (true) {
      case estimate > 8:
        return high();
      case estimate > 3:
        return medium();
      default:
        return low();
    }
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
          <EffortEstimateDropdown
            location={location}
            showIcon={showIcon}
            handleButtonClick={handleButtonClick}
            handleClickAway={handleClickAway}
          />
        )}
      </div>
    </>
  );
};

export default EffortEstimateButton;
