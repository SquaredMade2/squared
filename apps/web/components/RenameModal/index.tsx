'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { RenameModalProps } from '@/components/RenameModal/RenameModal.interfaces';
import type { InputChangeEvent, FormSubmitEvent } from '@/types';
import { Pencil } from '@/components/Svg';
import { updateTitle } from '@/api/taskApi';
import { getAllTasks } from '@/store/taskData/thunks';

const styles = {
  main: 'w-[640px] xs:w-[calc(100%-10px)] border border-border fixed top-1/4 bg-popover rounded-lg text-foreground shadow-[#00000080] shadow-[0px_16px_70px] z-40',
  input: 'bg-popover focus:outline-none py-5 block text-lg w-full',
  title: 'bg-popoverHover inline-block px-3 py-0.5 rounded mt-5 text-sm',
  mainWrapper: 'px-5',
  renameButton:
    'bg-popoverHover rounded pl-3.5 py-2.5 flex items-center whitespace-nowrap overflow-hidden text-sm w-full',
  renameContainer: 'p-1.5 border-t border-border',
  pencil: 'mr-2.5',
  renameSecondary: 'text-muted-foreground',
  container: 'w-full mdsm:w-full flex justify-center z-40',
};

const RenameModal = ({
  showRenameModal,
  setShowRenameModal,
  taskData,
  searchSubmit,
}: RenameModalProps) => {
  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState<string>('');
  const theme = useAppSelector((state) => state.userSettings.theme);
  const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
  const [fillColor, setFillColor] = useState<string>('');

  const modalRef = useRef<HTMLFormElement | null>(null);

  const handleChange = (e: InputChangeEvent): void => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
    e.preventDefault();
    if (inputValue !== taskData?.title) {
      await updateTitle(inputValue.trim(), taskData._id);
      dispatch(getAllTasks(currentTeam));
      if (searchSubmit) {
        searchSubmit(e);
      }
      setShowRenameModal(false);
    }
  };

  const handleThemeSVG = (): void => {
    theme === 'light' ? setFillColor('fill-black') : setFillColor('fill-gray-500');
  };

  useEffect(() => {
    function handleClickAway(event: MouseEvent): void {
      if (
        modalRef.current &&
        event.target instanceof Node &&
        !modalRef.current.contains(event.target)
      ) {
        setInputValue(taskData?.title);
        setShowRenameModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [taskData]);

  useEffect(() => {
    setInputValue(taskData?.title);
  }, [taskData]);

  useEffect(() => {
    handleThemeSVG();
  }, [theme]);

  const { title } = taskData ?? {};

  return (
    <>
      {showRenameModal && (
        <div className={styles.container}>
          <form ref={modalRef} className={styles.main} onSubmit={handleSubmit}>
            <div className={styles.mainWrapper}>
              <h2 className={styles.title}>{title}</h2>
              <input
                type="text"
                className={styles.input}
                value={inputValue}
                onFocus={(e) => e.target.select()}
                spellCheck="false"
                placeholder="Rename..."
                onChange={handleChange}
              />
            </div>
            <div className={styles.renameContainer}>
              <button className={styles.renameButton} type="button">
                <span className={styles.pencil}>{<Pencil className={`${fillColor}`} />}</span>
                <p>
                  Rename issue to{' '}
                  <span className={styles.renameSecondary}>{`"${inputValue}"`}</span>
                </p>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default RenameModal;
