import { additionIcon, downArrow } from '@/components/Svg';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { backlog, todo, inProgress, done, canceled, duplicate } from '@/components/Svg';
import type { TaskColumnTitleProps } from './TaskColumnTitle.interfaces';
import HideStatus from '@/components/HideStatus/HideStatus';
import { setShowNewIssue } from '@/store/showNewIssue';
import { setStatus } from '@/store/taskData';

const style = {
  columnTitle: 'flex items-center gap-4 text-foreground text-sm pr-8',
  columnTitleList: 'flex items-center  text-foreground text-sm',
  svg: 'w-4 lg:mr-2 mr-1.5',
  collapseArrow:
    'flex justify-center items-center transform transition-transform duration-300 lg:mr-2 mr-1.5',
  numOfTasks: 'ml-2 text-muted-foreground',
  subTitleSpacing:
    'flex flex-row w-full justify-between bg-secondary rounded-lg  px-2 h-10 mb-3 font-bold',

  subTitleSpacingList:
    'flex w-full bg-secondary items-center justify-between rounded-t-lg xs:px-5 sm:px-5 lg:px-[42px] py-2 font-medium transition-all',

  subIconContainer: 'flex flex-row gap-2 items-center text-foreground',
  subIconContainerList: 'flex bg-secondary gap-2 text-foreground',
};

const TaskColumnTitle = ({
  isListView,
  showTasks,
  title,
  numberOfTasks,
  toggleShowTasks,
}: TaskColumnTitleProps) => {
  const theme = useAppSelector((state) => state.userSettings.theme);
  const dispatch = useAppDispatch();
  const arrowColor = theme === 'light' ? 'black' : 'white';

  const showIcon = (name: string): React.ReactNode => {
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

  const handleClick = (): void => {
    dispatch(setShowNewIssue(true));
    dispatch(setStatus(title));
  };

  return (
    <div
      className={
        isListView
          ? numberOfTasks > 0
            ? style.subTitleSpacingList
            : `${style.subTitleSpacingList} rounded-b-lg`
          : style.subTitleSpacing
      }
    >
      {!isListView && (
        <div
          className={`${style.collapseArrow} ${showTasks ? 'absolute opacity-0' : '-rotate-90'}`}
        >
          {downArrow(arrowColor, 15, 10)}
        </div>
      )}
      {!isListView ? (
        showTasks && (
          <div className={isListView ? style.columnTitleList : style.columnTitle}>
            <div className={style.svg}>{showIcon(title)}</div>
            <span>{title}</span>
            <span className={style.numOfTasks}>{numberOfTasks}</span>
          </div>
        )
      ) : (
        <div className={isListView ? style.columnTitleList : style.columnTitle}>
          <div className={style.svg}>{showIcon(title)}</div>
          <span>{title}</span>
          <span className={style.numOfTasks}>{numberOfTasks}</span>
        </div>
      )}
      <div className={isListView ? style.subIconContainerList : style.subIconContainer}>
        <div className="cursor-pointer" onClick={handleClick}>
          <div className="group cursor-pointer">{additionIcon(theme)}</div>
        </div>

        <HideStatus toggleShowTasks={toggleShowTasks} showTasks={showTasks} />
      </div>
    </div>
  );
};

export default TaskColumnTitle;
