import { useState } from 'react';
import type { FC, ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  tooltipLabel?: string | null;
  handleClick?: () => void;
  hoverBg?: string;
  children?: ReactNode;
  labelPosition?:
    | 'top'
    | 'bottom'
    | 'right'
    | 'left'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left';
};

const styles = {
  wrapper:
    'relative flex whitespace-nowrap text-muted-foreground cursor-pointer hover:text-foreground',
  label:
    'opacity-0 sm:opacity-100 absolute z-40 text-xs border rounded bg-popover w-auto flex items-center gap-1 px-1 py-1',
  icon: 'flex items-center justify-center rounded-full w-8 h-8 hover:border',
};

const getPositionClasses = (position: Props['labelPosition']) => {
  switch (position) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-1';
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 mt-1';
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2 ml-1';
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2 mr-1';
    case 'top-right':
      return 'bottom-full left-full transform -translate-x-full mb-1';
    case 'top-left':
      return 'bottom-full right-full transform translate-x-full mb-1';
    case 'bottom-right':
      return 'top-full left-full transform -translate-x-full mt-1';
    case 'bottom-left':
      return 'top-full right-full transform translate-x-full mt-1';
    default:
      return '';
  }
};

const ButtonIcon: FC<Props> = ({
  icon,
  tooltipLabel = null,
  labelPosition,
  handleClick,
  hoverBg,
  children,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const switchHover = () => {
    setIsHovering(!isHovering);
  };
  const iconHover = hoverBg ? `hover:${hoverBg}` : '';

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={switchHover}
      onMouseLeave={switchHover}
      onClick={handleClick}
    >
      <div className={`${styles.icon} ${iconHover}`}>{icon}</div>
      {isHovering && tooltipLabel !== null && (
        <div className={`${styles.label} ${getPositionClasses(labelPosition)}`}>
          <p className="flex">{tooltipLabel}</p>
          {children}
        </div>
      )}
    </div>
  );
};

export default ButtonIcon;
