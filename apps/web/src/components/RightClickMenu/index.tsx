'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type {
  Color,
  RightClickMenuProps,
} from '@/components/RightClickMenu/RightClickMenu.interfaces';
import { TrashCan, Pencil } from '@/components/Svg';

const styles = {
  main: ' bg-popover text-popover-foreground fixed border border-border z-10 cursor-default rounded',
  mainWrapper: 'w-full h-full p-1.5',
  itemWrapper: 'flex items-center hover:bg-popoverHover py-1 pr-3 pl-1 rounded',
  svg: 'mr-2',
};

const RightClickMenu = ({
  x,
  y,
  task,
  setShowRenameModal,
  handleDeleteTaskCard,
}: RightClickMenuProps) => {
  const theme = useAppSelector((state) => state.userSettings.theme);
  const [fillColor, setFillColor] = useState<Color>({
    hover: '',
    color: '',
  });

  const handleThemeSVG = (): void => {
    theme === 'light'
      ? setFillColor({
          hover: 'group-hover:fill-black',
          color: 'fill-gray-500',
        })
      : setFillColor({ ...fillColor, hover: 'group-hover:fill-white' });
  };

  useEffect(() => {
    handleThemeSVG();
  }, [theme]);

  return (
    //Inline styling on purpose.
    <div className={styles.main} style={{ top: `${y}px`, left: `${x}px` }}>
      <div className={styles.mainWrapper}>
        <ul>
          {setShowRenameModal && (
            <li onClick={() => setShowRenameModal(true)} className={`${styles.itemWrapper} group`}>
              <span className={styles.svg}>
                {<Pencil className={`${fillColor.color} ${fillColor.hover}`} />}
              </span>
              <p>Rename...</p>
            </li>
          )}
          <li
            className={`${styles.itemWrapper} group`}
            onClick={() => {
              handleDeleteTaskCard(task);
            }}
          >
            <span className={styles.svg}>
              {<TrashCan className={`${fillColor.hover} ${fillColor.color}`} />}
            </span>
            <p>Delete</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightClickMenu;
