import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import axios from 'axios';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Combobox } from '@headlessui/react';
import { checkmark } from '@/components/Svg';
import { setPriority } from '@/store/taskData';
import { getSingleTask } from '@/store/task/thunks';
import { priorityOptions } from '@/constants/designations';
import type { PriorityDropdownProps } from '@/components/PriorityDropdown/PriorityDropdown.interfaces';
import useLogTaskEvent from '@/hooks/useLogTaskEvent';
import { EventType } from '@/interfaces/event.interfaces';

const styles = {
  container:
    'relative z-[1]  max-w-[220px] bg-popover border border-border p-1 font-medium text-foreground text-sm shadow-lg rounded-md',
  search: 'p-2 mb-3 border-b border-border focus:outline-none bg-popover',
  svg: 'w-4 h-4 mx-2',
  item: 'flex flex-row text-center justify-between hover:bg-popoverHover rounded-md py-1 px-2',
  checkmark: 'w-4 h-4 mr-2',
  left: 'flex flex-row items-center',
  newIssue: 'absolute top-8',
  issueSidebar: 'absolute top-0 -left-[220px] ',
};

const PriorityDropdown = ({
  handleButtonClick,
  location,
  showIcon,
  handleClickAway,
}: PriorityDropdownProps) => {
  const dispatch = useAppDispatch();
  const newIssuePriority = useAppSelector((state) => state.taskData.priority);
  const sidebarPriority = useAppSelector((state) => state.singleTask.data?.priority);
  const taskId = useAppSelector((state) => state.singleTask?.data?._id);

  const { author, storeCommonFields, storeType, storeTaskValue, updateTaskValue, taskEvent } =
    useLogTaskEvent();

  const [query, setQuery] = useState('');

  const handleSelectPriority = (newPriority: string) => {
    if (location === 'issueSidebar') {
      if (newPriority === sidebarPriority) return;
      if (taskId !== undefined) storeCommonFields(author, taskId);
      logEvent(newPriority);
      updateItem(newPriority);
    }
    if (location === 'newIssue') {
      if (newPriority === 'No priority') {
        dispatch(setPriority(null));
      } else {
        dispatch(setPriority(newPriority));
      }
    }
  };

  const filteredPriorityOptions =
    query === ''
      ? priorityOptions
      : priorityOptions.filter((name) => {
          return name.toLowerCase().includes(query.toLowerCase());
        });

  const updateItem = async (newPriority: string) => {
    if (taskId !== undefined) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/task/update/${taskId}`, {
          priority: newPriority,
        });
        dispatch(getSingleTask(taskId as string));
      } catch (err) {}
    }
  };

  const logEvent = (newPriority: string) => {
    storeType(EventType.PriorityUpdated);
    if (sidebarPriority) {
      storeTaskValue(sidebarPriority);
      updateTaskValue(newPriority);
    }
  };

  const closeDropdown = () => {
    handleButtonClick();
  };

  useEffect(() => {
    if (taskEvent.updatedValue) {
      closeDropdown();
    }
  }, [taskEvent.updatedValue]);

  return (
    <ClickAwayListener onClickAway={() => handleClickAway()}>
      <Combobox>
        <div className={location === 'newIssue' ? styles.newIssue : styles.issueSidebar}>
          <div className={styles.container}>
            <Combobox.Input
              placeholder={'Change priority here...'}
              onChange={(event) => setQuery(event.target.value)}
              className={styles.search}
            />
            <Combobox.Options static>
              {filteredPriorityOptions.map((name) => {
                let isChecked = false;
                if (location === 'newIssue') isChecked = newIssuePriority === name;
                if (location === 'issueSidebar') isChecked = sidebarPriority === name;
                return (
                  <Combobox.Option
                    onClick={() => handleSelectPriority(name)}
                    value={name}
                    key={name}
                    className={styles.item}
                  >
                    <div className={styles.left}>
                      <div className={styles.svg}>{showIcon(name)}</div>
                      <span>{name}</span>
                    </div>
                    {isChecked && <div className={styles.checkmark}>{checkmark()}</div>}
                  </Combobox.Option>
                );
              })}
            </Combobox.Options>
          </div>
        </div>
      </Combobox>
    </ClickAwayListener>
  );
};

export default PriorityDropdown;
