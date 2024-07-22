import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { deleteSelectedFilter } from '@/store/filterPage/actions';
import type { WidgetLabelDropdownProps } from './WidgetLabelDropdown.interfaces';

const WidgetLabelDropdown = ({ label, setFilter, getColorFromLabel }: WidgetLabelDropdownProps) => {
  const [checked, setChecked] = useState(false);

  const changeChecked: () => void = () => {
    setChecked(!checked);
  };

  const dispatch = useAppDispatch();

  const currentFilters = useAppSelector((state) => state.filterPage.currentFilters);

  const styles = {
    label: `flex flex-row h-13 items-center ${
      checked === true ? 'bg-accent' : ''
    } hover:bg-accent duration-200 p-2 rounded-xl`,
    assigneeLabel:
      'flex flex-row justify-center items-center rounded-full border border-border p-1 pr-3',
    amount: 'ml-auto',
    colorIcon: 'w-3 h-3 rounded-full m-2',
    // Leave these two here for future
    checkboxWrapper: 'bg-textField',
    checkbox: 'bg-textField accent-black m-2 w-10 h-5',
  };

  const deleteFilter: (taskAttributeDeleted: string) => void = (taskAttributeDeleted) => {
    const updatedAttributes = currentFilters.labels.filter(
      (taskAttribute) => taskAttribute !== taskAttributeDeleted,
    );
    const updatedFilters = {
      ...currentFilters,
      labels: updatedAttributes,
    };
    dispatch(deleteSelectedFilter(updatedFilters));
  };

  useEffect(() => {
    checked === true ? setFilter(label[0]) : deleteFilter(label[0]);
  }, [checked]);

  return (
    <div className={styles.label} key={label[0]} onClick={changeChecked}>
      <div className={styles.assigneeLabel}>
        <div
          className={styles.colorIcon}
          style={{ backgroundColor: getColorFromLabel(label[0]) }}
        />
        <p>{label[0]}</p>
      </div>
      <header className={styles.amount}>{label[1]}</header>
    </div>
  );
};

export default WidgetLabelDropdown;
