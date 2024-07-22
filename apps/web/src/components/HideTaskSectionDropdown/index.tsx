import { ClickAwayListener } from '@mui/base';
import type { HideTaskStatusDropdownProps } from './HideTaskSectionDropdown.interfaces';

const style = {
  hideStatusBg:
    'border bg-card px-3 py-1 rounded absolute  top-9 right-0 shadow-xs hover:bg-gray-50 hover:shadow active:shadow-xs active:bg-gray-40 z-10',
};

const HideTaskStatusDropdown = ({
  toggleHideDropdown,
  showTasks,
  toggleShowTasks,
}: HideTaskStatusDropdownProps) => {
  const handleClick = (): void => {
    toggleHideDropdown();
    toggleShowTasks();
  };

  return (
    <ClickAwayListener onClickAway={() => toggleHideDropdown()}>
      {showTasks ? (
        <button type="button" className={style.hideStatusBg} onClick={handleClick}>
          Hide
        </button>
      ) : (
        <button type="button" className={style.hideStatusBg} onClick={handleClick}>
          Unhide
        </button>
      )}
    </ClickAwayListener>
  );
};

export default HideTaskStatusDropdown;
