import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import PurpleToggle from "@/components/PurpleToggle";
import {
  setShowPriority,
  setShowLabels,
  setShowDateTime,
} from "@/store/toggleTaskFeatures";

const style = {
  toggleWrapper: "flex items-center justify-between w-full",
  listText: "text-foreground text-xs py-1 mb-1 last:mb-0",
};

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
    </div>
  );
};

export default DisplayPreferences;
