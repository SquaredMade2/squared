import { useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { addSymbol, labelIcon } from '@/components/Svg';
import { setBackgroundColor } from '../DesignationsContainer';
import LabelDropdown from '@/components/LabelDropdown';
import { labelOptions } from '@/constants/designations';
import type { RootState } from '@/store';
import type { LabelButtonProps, LabelColorProps } from './LabelButton.interfaces';

const styles = {
  newIssueContainer: 'relative',
  issueSidebarContainer: 'relative flex flex-row flex-wrap',
  container: 'relative flex flex-wrap',
  svg: 'w-4 h-4',
  svgAdd: 'w-3 cursor-pointer',
  buttonNewIssue:
    'inline-flex cursor-pointer items-center h-7 border border-border rounded px-2 py-0.5 mr-3 text-card-foreground text-sm shadow-md',
  buttonSidebar:
    'inline-flex cursor-pointer items-center border border-border hover:border-border rounded-3xl px-3 py-1 m-1 text-sm',
  buttonSidebarAdd:
    'inline-flex cursor-pointer items-center border border-border hover:border-border rounded-3xl px-3 py-1 my-1 ml-0.5 text-card-foreground text-xs',
  textSidebar: 'ml-3 text-sm font-semibold text-card-foreground cursor-pointer',
  textAddLabel: 'ml-1.5 text-sm font-semibold text-card-foreground cursor-pointer',
  smallButton: 'cursor-pointer border border-border hover mr-2 px-1.5 py-1 rounded-md shadow-md',
  labelContainer: 'flex items-center',
  defaultText: 'text-sm font-semibold text-card-foreground ml-2',
  singleLabelText: 'text-sm font-semibold text-card-foreground ml-2',
  multipleLabelsButton: 'flex bg-black cursor-pointer',
  labelColorsContainer: 'relative wrap',
  multipleLabelsText: 'text-sm font-semibold text-card-foreground ml-2 cursor-pointer',
  multipleLabels: {
    1: '-mr-[5px]',
    2: '-mr-[5px]',
    3: '-mr-[5px]',
  } as Record<number, string>,
};

// Leave comment in:
// Don't add margins to the styles below as it will effect the overlap appearance in the New Issue Modal
// when multiple labels are selected.
export const labelStyle: Record<string, string> = {
  Bug: 'w-3 h-3 rounded-lg bg-[#EB5757]',
  Feature: 'w-3 h-3 rounded-lg bg-[#BB87FC]',
  Improvement: 'w-3 h-3 rounded-lg bg-[#4EA7FC]',
  Red: 'w-3 h-3 rounded-lg bg-[#DB6E1F]',
  Test: 'w-3 h-3 rounded-lg bg-[#95A2B3]',
};

export const LabelColor = ({ name }: LabelColorProps) => {
  return <div className={labelStyle[name]} />;
};

const LabelButton = ({ location }: LabelButtonProps) => {
  const newIssueLabels = useAppSelector((state: RootState) => state.taskData.labels);
  const sidebarLabels = useAppSelector((state) => state.singleTask.data?.labels);
  const newIssuePriority = useAppSelector((state) => state.taskData.priority);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme } = useAppSelector((state) => state.userSettings);

  const handleBackground = () => {
    return theme === 'light'
      ? 'bg-popover hover:bg-popoverHover'
      : 'bg-popoverHover hover:bg-popover';
  };

  const newIssueButton = () => {
    return (
      <button
        type="button"
        className={
          newIssuePriority && newIssueLabels.length === 0
            ? `${styles.smallButton} ${handleBackground()}`
            : `${styles.buttonNewIssue} ${handleBackground()}`
        }
        onClick={handleButtonClick}
      >
        {newIssueLabels && newIssueLabels.length === 0 && (
          <>
            <div className={styles.svg}>{labelIcon()}</div>
            {!newIssuePriority && <span className={styles.defaultText}>Label</span>}
          </>
        )}
        {newIssueLabels && newIssueLabels.length === 1 && (
          <div className={styles.labelContainer}>
            <LabelColor name={newIssueLabels[0]} />
            <span className={styles.singleLabelText}>{newIssueLabels[0]}</span>
          </div>
        )}
        {newIssueLabels && newIssueLabels.length > 1 && (
          <div className={styles.labelContainer}>
            {
              // eslint-disable-next-line array-callback-return
              newIssueLabels.map((name, i) => {
                const multipleLabels: string = styles.multipleLabels[i + 1];
                if (i <= 2) {
                  return (
                    <div key={name} className={multipleLabels}>
                      <LabelColor name={name} />
                    </div>
                  );
                }
              })
            }
            <span className={styles.multipleLabelsText}>{`${newIssueLabels.length} labels`}</span>
          </div>
        )}
      </button>
    );
  };

  const issueSidebarButton = () => {
    return (
      <div>
        {sidebarLabels?.map((name: string) => {
          return (
            <button
              type="button"
              key={name}
              className={`${styles.buttonSidebar} ${setBackgroundColor(
                theme,
              )} ${handleBackground()} group`}
              onClick={handleButtonClick}
            >
              <LabelColor name={name} />
              <span className={`${styles.textSidebar} group-hover:text-foreground`}>{name}</span>
            </button>
          );
        })}
        <button type="button" className={styles.buttonSidebarAdd} onClick={handleButtonClick}>
          <span className={styles.svgAdd}>{addSymbol()}</span>
          <span className={styles.textAddLabel}>Add label</span>
        </button>
      </div>
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
          <LabelDropdown
            labelOptions={labelOptions}
            location={location}
            handleButtonClick={handleButtonClick}
            handleClickAway={handleClickAway}
          />
        )}
      </div>
    </>
  );
};

export default LabelButton;
