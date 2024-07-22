import type React from 'react';
import { helpCircle } from '@/components/Svg';
import type { HelpButtonProps } from './HelpButton.interfaces';
import { styles } from './HelpButton.styles';

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} aria-label="Help about effort estimation" type="button">
      {' '}
      <span className={styles.svg}>{helpCircle()}</span>
    </button>
  );
};

export default HelpButton;
