'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import { SearchIcon } from '@/components/Svg';
import { setIsCmdPalette } from '@/store/isCmdPalette';
// Line 10 setTaskPage should be set to getSingleTask I think
import { setTaskPage } from '@/store/taskData';
import { styles } from './CommandPalette.styles';
import type { Task } from '@/store/taskData/taskData.interfaces';

const CommandPalette = () => {
  const dispatch = useAppDispatch();

  const { isCmdPalette } = useAppSelector((state) => state.isCmdPalette);
  const taskList = useAppSelector((state) => state.taskData.taskList);

  const [query, setQuery] = useState('');

  const filteredTaskTitle = query
    ? taskList?.filter((task) => task?.taskName?.toLowerCase().includes(query.toLowerCase()))
    : [];
  const router = useRouter();

  const handleChange = (task: Task): void => {
    dispatch(setIsCmdPalette(false));
    // setTaskPage should be set to getSingleTask
    dispatch(setTaskPage(task));
    router.push(`/tasks/${task._id}`);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        dispatch(setIsCmdPalette(false));
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };

    // eslint-disable-next-line
  }, [setIsCmdPalette]);

  return (
    <Transition.Root
      show={isCmdPalette}
      as={Fragment}
      afterLeave={() => {
        setQuery('');
      }}
    >
      <Dialog onClose={setIsCmdPalette} className={styles.dialog}>
        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className={styles.dialogOverlay}>
            <Transition.Child
              enter="duration-30 ease-in"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Combobox onChange={handleChange} as="div" className={styles.comboBox}>
                <div className={styles.searchIcon}>
                  {SearchIcon()}
                  <Combobox.Input
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                    className={styles.comboBoxInput}
                    placeholder="Search..."
                  />
                </div>
                {filteredTaskTitle?.length > 0 && (
                  <div className={styles.optionWrapper}>
                    {filteredTaskTitle?.map((task) => (
                      <Combobox.Option className="list-none" key={task._id} value={task}>
                        {({ active }) => (
                          <div
                            className={active ? styles.optionDiv.active : styles.optionDiv.inactive}
                          >
                            <span
                              className={active ? styles.taskName.active : styles.taskName.inactive}
                            >
                              {task.taskName?.toUpperCase()}
                            </span>
                            <span
                              className={
                                active ? styles.taskStatus.active : styles.taskStatus.inactive
                              }
                            >
                              in {task.status}
                            </span>
                          </div>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                )}
                {query && filteredTaskTitle?.length === 0 && (
                  <p className={styles.noResult}>No results found.</p>
                )}
              </Combobox>
            </Transition.Child>
          </Dialog.Overlay>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandPalette;
