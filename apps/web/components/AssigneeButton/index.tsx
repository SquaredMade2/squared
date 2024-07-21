import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { UnassignedSVGInDropdown } from '@/components/Svg';
import ProfileImage from '@/components/ProfileImage';
import type { AssigneeButtonProps } from './AssigneeButton.interfaces';

const styles = {
  assigneeButton: 'flex flex-row items-center text-foreground cursor-pointer',
  labelStyles: 'cursor-pointer',
};

export const AssigneeButton = ({
  showAssigneeDropdown,
  setShowAssigneeDropdown,
}: AssigneeButtonProps) => {
  const assignee = useAppSelector((state) => state.singleTask.data?.assignee);

  const handleAssigneeDisplay: () => React.JSX.Element = () => {
    return assignee && assignee.name !== null ? (
      <ProfileImage profileName={assignee.name} location={'assigneeDropdown'} />
    ) : (
      UnassignedSVGInDropdown()
    );
  };

  const handleAssigneeNameDisplay: () => string = () => {
    return assignee && assignee.name !== null ? assignee.name : 'Unassigned';
  };

  const toggleAssigneeDropdown: () => void = () => {
    setShowAssigneeDropdown(!showAssigneeDropdown);
  };

  return (
    <button type="button" className={styles.assigneeButton} onClick={toggleAssigneeDropdown}>
      {handleAssigneeDisplay()}
      <label className={styles.labelStyles}> {handleAssigneeNameDisplay()} </label>
    </button>
  );
};
