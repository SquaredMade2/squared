import { useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { UsersInWorkspace } from '@/store/taskData/taskData.interfaces';
import ProfileImage from '../ProfileImage';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { UnassignedSVGInDropdown } from '../Svg';
import useLogTaskEvent from '@/hooks/useLogTaskEvent';
import { EventType, type Assignee } from '@/interfaces/event.interfaces';
import type { AssigneeDropdownProps } from './AssigneeDropdown.interfaces';

export const AssigneeDropdown = ({
  taskId,
  location,
  setShowAssigneeDropdown,
  handleAssigneeChange,
}: AssigneeDropdownProps) => {
  const [userFilter, setUserFilter] = useState('');
  const theme = useAppSelector((state) => state.userSettings.theme);
  const allUsers = useAppSelector((state) => state.taskData.allUsersInWorkspace);

  const currentAssignee = useAppSelector((state) => state.singleTask?.data?.assignee) || null;

  const taskDataReceived = useAppSelector((state) => state.singleTask?.data) || null;

  const { author, storeCommonFields, storeTaskAssignee, storeType, updateTaskAssignee } =
    useLogTaskEvent();

  const preventDefault: (e: React.MouseEvent<HTMLDivElement>) => void = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const styles = {
    dropdownWrapperGrid: `absolute top-10 right-1 flex flex-col ${
      theme === 'dark' ? 'bg-card' : 'bg-gray-50'
    } click-event-none border border-border rounded-lg overflow-hidden z-30 w-50 h-60 flex flex-col`,
    dropdownWrapperDashboard: `absolute flex flex-col ${
      theme === 'dark' ? 'bg-card' : 'bg-gray-50'
    } click-event-none border border-border rounded-lg overflow-hidden ml-auto z-30 flex-end col-span-6 flex flex-col`,
    assignButton: 'flex flex-row items-center mx-1',
    inputFilter: 'bg-card h-10 p-1 border-b border-border',
    overflowHandler: 'overflow-scroll-y',
    taskPage: `flex flex-col text-foreground ${
      theme === 'dark' ? 'bg-card' : 'bg-gray-50'
    } border border-border rounded-lg overflow-hidden ml-20 flex-end col-span-6 flex flex-col`,
  };

  const handleLocation: () => string = () => {
    switch (location) {
      case 'Grid':
        return styles.dropdownWrapperGrid;
      case 'Dashboard':
        return styles.dropdownWrapperDashboard;
      case 'taskPage':
        return styles.taskPage;
      default:
        return '';
    }
  };

  const handleClickOffDropdown: () => void = () => {
    setShowAssigneeDropdown(false);
  };

  const handleFilter: (username: string) => boolean = (username) => {
    if (userFilter.length !== 0) {
      return username.includes(userFilter);
    }
    return true;
  };

  const handleStoreCurrentAssignee = (): void => {
    const noUserAssigned = currentAssignee?.name === null;
    if (taskDataReceived) {
      if (noUserAssigned) {
        const assignee = {
          id: '',
          name: 'not Assigned',
        };
        storeTaskAssignee(assignee);
      } else {
        storeTaskAssignee(currentAssignee as Assignee);
      }
    }
  };

  const handleClickAssignee = (taskId: string, newAssignee: Assignee): void => {
    if (newAssignee.name === currentAssignee?.name) return;
    storeCommonFields(author, taskId);
    storeType(EventType.AssigneeUpdated);
    handleStoreCurrentAssignee();
    handleAssigneeChange(taskId, newAssignee);
    logAssigneeChangeEvent(newAssignee);
  };

  const logAssigneeChangeEvent = (newAssignee: Assignee): void => {
    const userIsAssigned = newAssignee.id && newAssignee.name;
    if (userIsAssigned) {
      updateTaskAssignee(newAssignee);
    } else {
      updateTaskAssignee({ id: '', name: 'not Assigned' });
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickOffDropdown}>
      <div onClick={(e) => preventDefault(e)} className={handleLocation()}>
        <input
          className={styles.inputFilter}
          type="text"
          onChange={(e) => setUserFilter(e.target.value)}
        />
        <button
          type="button"
          className={styles.assignButton}
          onClick={() => handleClickAssignee(taskId, { id: null, name: null })}
        >
          <UnassignedSVGInDropdown />
          Unassign
        </button>
        <ul className={styles.overflowHandler}>
          {allUsers
            ?.filter((user) => handleFilter(user.username))
            .map((user: UsersInWorkspace) => {
              const assignee = {
                id: user.user,
                name: user.username,
              };
              return (
                <li key={user.user}>
                  <button
                    type="button"
                    className={styles.assignButton}
                    onClick={() => handleClickAssignee(taskId, assignee)}
                  >
                    <ProfileImage profileName={user.username} location={'assigneeDropdown'} />
                    {user.username}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </ClickAwayListener>
  );
};
