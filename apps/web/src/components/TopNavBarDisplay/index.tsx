import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { setView } from '@/store/userSettings';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { motion, AnimatePresence } from 'framer-motion';
import { displayIcon, downIcon } from '@/components/Svg';
import PurpleToggle from '@/components/PurpleToggle';
import { setShowPriority, setShowLabels, setShowDateTime } from '@/store/toggleTaskFeatures';

const style = {
  main: 'flex flex-col gap-2 items-end relative h-10 hover:bg-accent',
  buttonBg:
    'border border-solid border-border rounded flex flex-row gap-2 items-center px-2 h-10 py-0.5 text-sm text-muted-foreground cursor-pointer shadow-md bg-card  hover:bg-accent hover:shadow-lg active:shadow-sm ',
  popUpBg:
    'bg-popover border border-solid border-border rounded px-4 py-3 shadow transition-opacity duration-300 absolute w-[300px] z-10 top-[41px]',
  layoutDiv: 'flex flex-row justify-between items-center my-1',
  layoutText: 'text-foreground text-sm',
  displayText: 'text-foreground text-sm pb-1 ',
  listButton: 'bg-popover px-2 mr-1 text-sm text-popover-foreground cursor-pointer',
  gridButton: 'bg-popover px-2 text-sm text-foreground cursor-pointer',
  listButtonActive:
    'border border-solid border-border rounded bg-purpleButton px-2 mr-1 text-sm text-white cursor-pointer',
  gridButtonActive:
    'border border-solid border-border rounded bg-purpleButton px-2 text-sm text-white cursor-pointer',
  resetDiv: 'flex justify-end w-full border-t border-solid border-border px-1 pt-1 mt-1',
  resetDefault: 'bg-card text-muted-foreground cursor-pointer',
  setDefault: 'bg-card text-foreground pl-5 cursor-pointer',
  displayProperties: '',
  group: 'group',
  displaySpan: 'cursor-pointer text-foreground',
  toggleWrapper: 'flex items-center justify-between w-full',
  listText: 'text-foreground text-sm py-1 mb-1 last:mb-0',
  divider: 'w-full border-t border-border block my-1',
};

const TopNavBarDisplay = () => {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.userSettings.view);
  const { showPriority, showLabels, showDateTime } = useAppSelector(
    (state) => state.toggleTaskFeatures,
  );

  const [dropDownOpen, setDropDownOpen] = useState(false);

  const handleDropDown = (): void => {
    setDropDownOpen(!dropDownOpen);
  };

  const handleClickAway = (): void => {
    setDropDownOpen(false);
  };

  const handleListClick = (): void => {
    dispatch(setView('list'));
  };

  const handleGridClick = (): void => {
    dispatch(setView('grid'));
  };

  const handlePriority = (): void => {
    dispatch(setShowPriority());
  };

  const handleLabels = (): void => {
    dispatch(setShowLabels());
  };

  const handleDateTime = (): void => {
    dispatch(setShowDateTime());
  };

  return (
    <div className={style.main}>
      <div className={style.group} onClick={handleDropDown}>
        <button type="button" className={style.buttonBg}>
          {displayIcon()}
          <span className={style.displaySpan}> Display</span>
          {downIcon()}
        </button>
      </div>
      <AnimatePresence>
        {dropDownOpen && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <motion.div
              className={style.popUpBg}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <div className={style.layoutDiv}>
                <span className={style.layoutText}>Layout</span>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      handleListClick();
                    }}
                    className={view === 'list' ? style.listButtonActive : style.listButton}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleGridClick();
                    }}
                    className={view === 'grid' ? style.gridButtonActive : style.gridButton}
                  >
                    Grid
                  </button>
                </div>
              </div>
              <span className={style.divider} />
              <ul>
                <div className={style.toggleWrapper}>
                  <p className={style.listText}>Priority</p>
                  <PurpleToggle active={showPriority} handleClick={handlePriority} />
                </div>
                <div className={style.toggleWrapper}>
                  <p className={style.listText}>Labels</p>
                  <PurpleToggle active={showLabels} handleClick={handleLabels} />
                </div>
                <div className={style.toggleWrapper}>
                  <p className={style.listText}>Date and Time</p>
                  <PurpleToggle active={showDateTime} handleClick={handleDateTime} />
                </div>
              </ul>
            </motion.div>
          </ClickAwayListener>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopNavBarDisplay;
