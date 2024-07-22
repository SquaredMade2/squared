import type React from 'react';
import { useState } from 'react';
import format from 'date-fns/format';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import TaskCardPriority from '@/components/TaskCardPriority';
import TaskCardStatus from '@/components/TaskCardStatus';
import { truncateString } from '@/utils/formatting';
import type { AssigneeParams, HandleAssigneeChange } from '@/app/interfaces/Tasks.interfaces';
import ProfileImage from '@/components/ProfileImage';
import { UnassignedSVG } from '@/components/Svg';
import { getAllTasks, setAssignee } from '@/store/taskData/thunks';
import { AssigneeDropdown } from '@/components/AssigneeDropdown';
import TaskCardLabels from '@/components/TaskCardLabels';
import type { TaskCardTitleProps } from './TaskCardTitle.interfaces';

const styles = {
  main: 'flex flex-row justify-between xs:ml-3 sm:ml-3 lg:ml-0 py-1',
  projectDiv: 'flex items-center flex-row gap-2 text-base',
  project: 'text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer',
  secondaryDiv: 'flex flex-row gap-2 pr-2  ',
  mainGrid: ' flex flex-col items-start justify-evenly cursor-pointer',
  titleGrid: 'flex flex-row text-base ',
  top: 'flex flex-row justify-between h-[20px] w-full cursor-pointer ',
  teamIdentifierDiv: 'flex justify-start items-center',
  teamIdentifierText: 'text-xs text-muted-foreground ',
  children: 'text-sm pr-8 cursor-pointer w-full',
  dateSection: 'flex col-span-4 items-center lg:pr-5 justify-end',
  dateDiv: 'text-muted-foreground md:flex xs:hidden sm:hidden mr-2 mdsm:mr-3',
  iconSection: 'flex col-span-3 items-center pl-3.5 ',
  assigneeDropdownWrapperList: 'absolute mr-40 mt-10 cursor-pointer',
  assigneeDropdownWrapperGrid: '',
  pointer: 'cursor-pointer',
  listViewTaskTitle: 'cursor-pointer',
};
// leave task and handleOpenDeleteCard in until delete function is added
const TaskCardTitle = ({
  taskTitle,
  task,
  isShown,
  highlightText,
  location,
}: TaskCardTitleProps) => {
  const { view } = useAppSelector((state) => state.userSettings);
  const dispatch = useAppDispatch();

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
  const { showDateTime, showLabels } = useAppSelector((state) => state.toggleTaskFeatures);

  const handleAssigneeIcon: () => React.JSX.Element = () => {
    return task.assignee?.name !== null && task.assignee ? (
      <ProfileImage profileName={task.assignee.name} location={'taskCard'} />
    ) : (
      UnassignedSVG()
    );
  };

  const toggleAssigneeDropdown: (e: React.MouseEvent<HTMLButtonElement>) => void = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setShowAssigneeDropdown(!showAssigneeDropdown);
  };

  const teamIdentifier = location === 'dashboard' ? currentTeam.identifier : task.team.identifier;

  const assigneeParams: AssigneeParams = (taskId, user) => {
    dispatch(getAllTasks(currentTeam));
    return { taskId: taskId, assignee: { id: user.id, name: user.name } };
  };

  const handleAssigneeChange: HandleAssigneeChange = async (taskId, user) => {
    dispatch(setAssignee(assigneeParams(taskId, user)));
    await dispatch(getAllTasks(currentTeam));
  };

  return (
    <>
      {view === 'list' || location === 'search' ? (
        <div>
          <div className={styles.main}>
            <div className={styles.projectDiv}>
              {isShown && (
                <div className="flex items-center">
                  <TaskCardPriority task={task} border={false} />
                  test
                </div>
              )}
              <span className={styles.project}>{teamIdentifier}</span>
              <div className="flex items-center">
                <TaskCardStatus task={task} />
              </div>
              {location === 'search' ? (
                <span>{highlightText(taskTitle)}</span>
              ) : (
                <span className={styles.listViewTaskTitle}>{taskTitle}</span>
              )}
            </div>
            <div className={styles.secondaryDiv} />
            <div className={styles.dateSection}>
              {showLabels && <TaskCardLabels task={task} view="list" />}
              {showDateTime && (
                <div className={styles.dateDiv}>
                  {task.dateCreated ? format(new Date(task.dateCreated), 'MMM dd') : 'No Date'}
                </div>
              )}
              <button
                type="button"
                onClick={(e) => toggleAssigneeDropdown(e)}
                className="cursor-pointer"
              >
                {handleAssigneeIcon()}
              </button>
              <div className={styles.assigneeDropdownWrapperList}>
                {showAssigneeDropdown && (
                  <AssigneeDropdown
                    taskId={task._id}
                    location="Dashboard"
                    setShowAssigneeDropdown={setShowAssigneeDropdown}
                    handleAssigneeChange={handleAssigneeChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.mainGrid}>
          <div className={styles.top}>
            <div className={styles.teamIdentifierDiv}>
              <p className={styles.teamIdentifierText}>{teamIdentifier}</p>
            </div>
            <button type="button" onClick={(e) => toggleAssigneeDropdown(e)} className="">
              {handleAssigneeIcon()}
            </button>
          </div>

          <div className={styles.children}>
            <span className={styles.pointer}>{truncateString(task.title, 70)}</span>
          </div>
          <div className={styles.assigneeDropdownWrapperGrid}>
            {showAssigneeDropdown && (
              <AssigneeDropdown
                taskId={task._id}
                location={'Grid'}
                setShowAssigneeDropdown={setShowAssigneeDropdown}
                handleAssigneeChange={handleAssigneeChange}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCardTitle;
