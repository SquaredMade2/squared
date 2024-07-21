import React from 'react';

import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';

import { ViewGridIcon, ViewListIcon } from '@/components/Svg';
import { setView } from '@/store/userSettings';

const style = {
  viewButton:
    ' h-10 w-16 bg-background bg-background cursor-pointer flex justify-center items-center rounded-sm box-border hover:bg-card',
  viewButtonActive:
    ' h-10 w-16 bg-card cursor-pointer flex justify-center items-center rounded-sm border border-border box-border hover:bg-card',
};

const ViewButton = () => {
  const dispatch = useAppDispatch();
  const { theme, view } = useAppSelector((state) => state.userSettings);

  return (
    <>
      <button
        type="button"
        className={view === 'list' ? style.viewButtonActive : style.viewButton}
        id="list-view"
        onClick={() => dispatch(setView('list'))}
      >
        {<ViewListIcon view={view} theme={theme} />}
      </button>
      <button
        type="button"
        className={view === 'grid' ? style.viewButtonActive : style.viewButton}
        id="grid-view"
        onClick={() => dispatch(setView('grid'))}
      >
        {<ViewGridIcon />}
      </button>
    </>
  );
};

export default ViewButton;
