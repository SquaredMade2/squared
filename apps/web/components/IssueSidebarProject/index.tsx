import React from 'react';
import { addSymbol } from '@/components/Svg';

const style = {
  row: 'flex flex-row items-center mb-4',
  designationTitle: 'w-[95px] h-4 my-2.5 text-sm text-muted-foreground',
  button:
    'inline-flex items-center w-[132.4px] h-[32.4px] border-[0.8px] border border-transparent rounded px-2 py-px mr-[-8px] text-foreground text-sm hover:bg-black hover:border-border',
  svg: 'ml-px mr-2.5 w-2 h-2',
};

const IssueSidebarProject = () => {
  return (
    <div className={style.row}>
      <div className={style.designationTitle}>
        <span>Project</span>
      </div>
      <div>
        <button className={style.button} type="button">
          <span className={style.svg}>{addSymbol()}</span>
          <span>Add Project</span>
        </button>
      </div>
    </div>
  );
};

export default IssueSidebarProject;
