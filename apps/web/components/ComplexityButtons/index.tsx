import type React from 'react';
import type {
  ComplexityButtonsProps,
  handleClickComplexityType,
  complexityLevelType,
} from './ComplexityButtons.interfaces';

const style = {
  container: 'flex flex-row gap-2',
  button:
    'bg-gray-700 text-gray-100 hover:bg-sky-400 hover:shadow-lg hover:ring-1 ring-black/5 active:bg-sky-500 active:scale-110 active:shadow-none rounded-full w-8 h-8 px-1 py-1 text-xs',
};

const complexityLevelOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const ComplexityButtons = ({ onSelect }: ComplexityButtonsProps): React.ReactElement => {
  const handleClick: handleClickComplexityType = (value: number) => {
    const complexityText = complexityLevel(value);
    onSelect(complexityText);
  };

  const complexityLevel: complexityLevelType = (value: number) => {
    let level = 'Its Over 9000';
    if (value >= 1 && value <= 3) {
      level = 'Easy ';
    } else if (value >= 4 && value <= 6) {
      level = 'Intermediate ';
    } else if (value === 7 || value === 8) {
      level = 'Hard ';
    }
    return level;
  };

  return (
    <div className={style.container}>
      {complexityLevelOptions.map((eachOption) => {
        return (
          <button
            key={eachOption}
            onClick={() => handleClick(eachOption)}
            className={style.button}
            type="button"
          >
            {eachOption}
          </button>
        );
      })}
    </div>
  );
};
