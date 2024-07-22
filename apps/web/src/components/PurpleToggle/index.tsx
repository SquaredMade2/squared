import type { PurpleToggleProps } from './interfaces.PurpleToggle';

const styles = {
  buttonContainerActive:
    'h-5 w-8 bg-purpleButton rounded-xl relative flex items-center cursor-pointer transition-colors duration-200',
  buttonContainer:
    'h-5 w-8 bg-gray-500 rounded-xl relative flex items-center cursor-pointer transition-colors duration-200',
  buttonBase: 'bg-white h-3.5 w-3.5 rounded-full absolute transition-transform duration-200 m-1',
};

const PurpleToggle = ({ active, handleClick }: PurpleToggleProps) => {
  return (
    <div
      className={`${active ? styles.buttonContainerActive : styles.buttonContainer}`}
      onClick={handleClick}
    >
      <div
        className={`${styles.buttonBase} ${
          active ? 'translate-x-[calc(100%-0.25rem)]' : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default PurpleToggle;
