import { useState } from 'react';
import LabelButton from '@/components/LabelButton';
import PriorityButton from '@/components/PriorityButton';
import StatusButton from '@/components/StatusButton';
import DateButton from '@/components/DateButton';
import EffortEstimateButton from '@/components/EffortEstimateButton';
import HelpButton from '@/components/HelpButton';
import EffortModal from '@/components/EffortModal';
import { AssigneeButton } from '@/components/AssigneeButton';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { getAllTasks, setAssignee } from '@/store/taskData/thunks';
import { AssigneeDropdown } from '@/components/AssigneeDropdown';
import { getSingleTask } from '@/store/task/thunks';
import type { AssigneeParams, HandleAssigneeChange } from '@/app/interfaces/Tasks.interfaces';
import type { DesignationsContainerProps } from './DesignationsContainer.interfaces';

const styles = {
  issueSidebarContainer: 'flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card',
  itemContainer: 'flex flex-row flex-start items-center w-full',
  textContainer:
    'flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]',
  extraContainer: 'ml-1.5 flex items-center',
  newIssueContainer: 'flex flex-row flex-start items-center h-9',
  assigneeLabelContainer: 'flex flex-row flex-start items-center',
  assigneeDropdownContainer: 'absolute mt-10',
  itemContainerAssignee: 'flex flex-col',
};

export const setBackgroundColor = (theme: string) => {
  if (theme === 'light') {
    return 'hover:bg-gray-50';
  }
  return 'hover:bg-accent';
};

const generateItemContainer = (
  text: string,
  ButtonComponent: React.ComponentType<DesignationsContainerProps>,
  location: string,
  ExtraComponent?: React.ReactNode,
): JSX.Element => (
  <div className={styles.itemContainer}>
    <div className={styles.textContainer}>
      <span>{text}</span>
      {ExtraComponent && <div className={styles.extraContainer}>{ExtraComponent}</div>}
    </div>
    <ButtonComponent location={location} />
  </div>
);

const DesignationsContainer = ({ location }: DesignationsContainerProps) => {
  const dispatch = useAppDispatch();
  const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
  const task = useAppSelector((state) => state.singleTask.data);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showEffortModal, setShowEffortModal] = useState(false);

  const handleOpenModal = () => setShowEffortModal(true);
  const handleCloseModal = () => setShowEffortModal(false);

  const assigneeParams: AssigneeParams = (taskId, user) => {
    dispatch(getAllTasks(currentTeam));
    if (task !== undefined) {
      dispatch(getSingleTask(task._id));
    }
    return { taskId: taskId, assignee: { id: user.id, name: user.name } };
  };

  const handleAssigneeChange: HandleAssigneeChange = async (taskId, user) => {
    dispatch(setAssignee(assigneeParams(taskId, user)));
    if (task !== undefined) {
      dispatch(getSingleTask(task._id));
    }
    await dispatch(getAllTasks(currentTeam));
  };

  const generateAssigneeContainer: () => React.JSX.Element = () => {
    return (
      <div className={styles.itemContainerAssignee}>
        <div className={styles.assigneeLabelContainer}>
          <div className={styles.textContainer}>Assignee</div>
          <AssigneeButton
            location={location}
            showAssigneeDropdown={showAssigneeDropdown}
            setShowAssigneeDropdown={setShowAssigneeDropdown}
          />
        </div>
        <div className={styles.assigneeDropdownContainer}>
          {showAssigneeDropdown && task !== undefined && (
            <AssigneeDropdown
              taskId={task?._id}
              location={'taskPage'}
              setShowAssigneeDropdown={setShowAssigneeDropdown}
              handleAssigneeChange={handleAssigneeChange}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {location === 'newIssue' && (
        <div className={styles.newIssueContainer}>
          <StatusButton location={location} />
          <PriorityButton location={location} />
          <LabelButton location={location} />
          <DateButton location={location} />
          <EffortEstimateButton location={location} />
        </div>
      )}

      {location === 'issueSidebar' && (
        <div className={styles.issueSidebarContainer}>
          {generateItemContainer('Status', StatusButton, location)}
          {generateItemContainer('Priority', PriorityButton, location)}
          {generateItemContainer('Labels', LabelButton, location)}
          {generateItemContainer('Due Date', DateButton, location)}
          {generateItemContainer(
            'Effort',
            EffortEstimateButton,
            location,
            <HelpButton onClick={handleOpenModal} />,
          )}
          {generateAssigneeContainer()}
        </div>
      )}
      <EffortModal isOpen={showEffortModal} onClose={handleCloseModal} />
    </>
  );
};

export default DesignationsContainer;
