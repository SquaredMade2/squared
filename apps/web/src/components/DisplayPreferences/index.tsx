import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import PurpleToggle from "@/components/PurpleToggle";
import {
  setShowPriority,
  setShowLabels,
  setShowDateTime,
} from "@/store/toggleTaskFeatures";

const toggleWrapper = "flex items-center justify-between w-full";
const listText = "text-foreground text-xs py-1 mb-1 last:mb-0";

const DisplayPreferences = () => {
  const dispatch = useAppDispatch();

  const { showPriority, showLabels, showDateTime } = useAppSelector(
    (state) => state.toggleTaskFeatures
  );

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
    <div>
      <ul>
        <div className={toggleWrapper}>
          <p className={listText}>Priority</p>
          <PurpleToggle active={showPriority} handleClick={handlePriority} />
        </div>
        <div className={toggleWrapper}>
          <p className={listText}>Labels</p>
          <PurpleToggle active={showLabels} handleClick={handleLabels} />
        </div>
        <div className={toggleWrapper}>
          <p className={listText}>Date and Time</p>
          <PurpleToggle active={showDateTime} handleClick={handleDateTime} />
        </div>
      </ul>
    </div>
  );
};

export default DisplayPreferences;
