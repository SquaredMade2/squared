import { ClickAwayListener } from '@mui/base';
import SelectIsOrIsNotDropDownIsNot from '@/components/SelectIsOrIsNotDropDownIsNot';
import SelectIsOrIsNotDropDownIs from '@/components/SelectIsOrIsNotDropDownIs';
import type { FilterSelectIsOrIsNotProps } from './FilterSelectIsOrIsNot.interfaces';

const styles = {
  main: 'absolute z-100 flex flex-col justify-center transition-all duration-300 -left-0.5 top-px bg-card hover:bg-accent',
  isButton:
    'flex items-center justify-center text-sm cursor-pointer py-1 bg-card hover:text-foreground hover:bg-accent',
  isNotButton:
    'flex items-center justify-center text-sm cursor-pointer pt-1 px-1 bg-card hover:text-foreground hover:bg-accent',
  topButton: 'w-full pb-1 border-transparent border-b hover:bg-accent',
  bottomButton:
    'pt-1 rounded-b border-transparent border-r border-b border-l hover:border-white hover:border-r hover:border-b hover:border-l hover:bg-accent',
};

const FilterSelectIsOrIsNot = ({
  setToggleSelectIsOrIsNot,
  toggleSelectIsOrIsNot,
  showSelectIsOrIsNot,
  setShowSelectIsOrIsNot,
}: FilterSelectIsOrIsNotProps) => {
  const handleMouseEnter = (): void => {
    setShowSelectIsOrIsNot(true);
  };

  const handleMouseLeave = (): void => {
    setShowSelectIsOrIsNot(false);
  };

  const handleClickAway = (): void => {
    setShowSelectIsOrIsNot(false);
  };

  const condensedPropsForDropdown = {
    handleMouseEnter: handleMouseEnter,
    handleMouseLeave: handleMouseLeave,
    showSelectIsOrIsNot: showSelectIsOrIsNot,
    setToggleSelectIsOrIsNot: setToggleSelectIsOrIsNot,
    setShowSelectIsOrIsNot: setShowSelectIsOrIsNot,
    isNotButton: styles.isNotButton,
    isButton: styles.isButton,
    topButton: styles.topButton,
    bottomButton: styles.bottomButton,
  };

  const handleIsNotDropdown = () =>
    !toggleSelectIsOrIsNot ? <SelectIsOrIsNotDropDownIsNot {...condensedPropsForDropdown} /> : '';
  const handleIsDropdown = () =>
    toggleSelectIsOrIsNot ? <SelectIsOrIsNotDropDownIs {...condensedPropsForDropdown} /> : '';

  return (
    showSelectIsOrIsNot && (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div
          className={`${styles.main} ${toggleSelectIsOrIsNot ? '' : 'left-1'}`}
          onMouseEnter={handleMouseEnter}
        >
          {handleIsDropdown()}
          {handleIsNotDropdown()}
        </div>
      </ClickAwayListener>
    )
  );
};

export default FilterSelectIsOrIsNot;
