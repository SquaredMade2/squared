import { useEffect, useState } from 'react';
import ProfileImage from '../ProfileImage';
import { UnassignedSVGInDropdown } from '../Svg';
import { deleteSelectedFilter } from '@/store/filterPage/actions';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { WidgetAssigneeDropdownProps } from './WidgetAssigneeDropdown.interfaces';

const WidgetAssigneeDropdown = ({ assignee, setFilter }: WidgetAssigneeDropdownProps) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = useState(false);

  const currentFilters = useAppSelector((state) => state.filterPage.currentFilters);

  const changeChecked: () => void = () => {
    setChecked(!checked);
  };

  const styles = {
    assignee: `flex flex-row h-13 items-center ${
      checked === true ? 'bg-accent' : ''
    } hover:bg-accent duration-200 p-2 rounded-xl`,
    assigneeLabel:
      'flex flex-row justify-center items-center rounded-full border border-border p-1 pr-3',
    amount: 'ml-auto',
    // Leave these two here for future
    checkboxWrapper: 'bg-textField',
    checkbox: 'bg-textField accent-black m-2 w-10 h-5',
  };

  const deleteFilter: (taskAttributeDeleted: string) => void = (taskAttributeDeleted: string) => {
    const updatedAttributes =
      currentFilters.assignee?.filter((taskAttribute) => {
        const ifUnassigned = taskAttributeDeleted === 'unassigned' && taskAttribute === null;
        if (taskAttribute !== taskAttributeDeleted) {
          return !ifUnassigned;
        }
      }) || null;
    const updatedFilters = {
      ...currentFilters,
      assignee: updatedAttributes,
    };
    dispatch(deleteSelectedFilter(updatedFilters));
  };

  useEffect(() => {
    checked === true ? setFilter(assignee[0]) : deleteFilter(assignee[0]);
  }, [checked]);

  return (
    <div className={styles.assignee} key={assignee[0]} onClick={changeChecked}>
      <div className={styles.assigneeLabel}>
        {assignee[0] === 'unassigned' ? (
          <UnassignedSVGInDropdown />
        ) : (
          <ProfileImage profileName={assignee[0]} location={'assigneeDropdown'} />
        )}
        <p>{assignee[0]}</p>
      </div>
      <header className={styles.amount}>{assignee[1]}</header>
    </div>
  );
};

export default WidgetAssigneeDropdown;
