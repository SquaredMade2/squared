import { useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import type { SelectIsOrIsNotDropDownIsProps } from './SelectIsOrIsNotDropDownIs.interface';

const SelectIsOrIsNotDropDownIs = ({
  handleMouseEnter,
  handleMouseLeave,
  showSelectIsOrIsNot,
  setToggleSelectIsOrIsNot,
  setShowSelectIsOrIsNot,
  isNotButton,
  isButton,
  topButton,
  bottomButton,
}: SelectIsOrIsNotDropDownIsProps) => {
  const [isIsNotLocation, setIsIsNotLocation] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  const hookCurrentMousePosition = useMousePosition();

  const mouseDistanceToLeft = Math.abs(hookCurrentMousePosition.x - isIsNotLocation.left);
  const mouseDistanceToTop = Math.abs(hookCurrentMousePosition.y - isIsNotLocation.top);
  const mouseDistanceToRight = Math.abs(hookCurrentMousePosition.x - isIsNotLocation.right);
  const mouseDistanceToBottom = Math.abs(hookCurrentMousePosition.y - isIsNotLocation.bottom);

  const ifShouldCloseDropdown =
    mouseDistanceToLeft > 70 ||
    mouseDistanceToTop > 70 ||
    mouseDistanceToRight > 70 ||
    mouseDistanceToBottom > 70;

  const ifShouldUpdateLocation = (e: Element) => {
    return (
      e &&
      isIsNotLocation.left !== e.getBoundingClientRect().left &&
      isIsNotLocation.top !== e.getBoundingClientRect().top &&
      isIsNotLocation.right !== e.getBoundingClientRect().right &&
      isIsNotLocation.bottom !== e.getBoundingClientRect().bottom
    );
  };

  const formatLocation = (element: Element) => {
    return {
      left: element.getBoundingClientRect().left,
      top: element.getBoundingClientRect().top,
      right: element.getBoundingClientRect().right,
      bottom: element.getBoundingClientRect().bottom,
    };
  };

  useEffect(() => {
    const updateLocation = () => {
      setIsIsNotLocation({
        top: isIsNotLocation.top,
        left: isIsNotLocation.left,
        right: isIsNotLocation.right,
        bottom: isIsNotLocation.bottom,
      });
    };

    window.addEventListener('resize', updateLocation);

    return () => {
      window.removeEventListener('resize', updateLocation);
    };
  }, []);

  useEffect(() => {
    if (ifShouldCloseDropdown && showSelectIsOrIsNot === true) {
      handleMouseLeave();
    }
  }, [hookCurrentMousePosition]);

  return (
    <div
      ref={(e) => {
        if (e) {
          if (ifShouldUpdateLocation(e)) {
            setIsIsNotLocation(formatLocation(e));
          }
        }
      }}
    >
      <button type="button" className={`${isButton} ${topButton}`} onMouseEnter={handleMouseEnter}>
        is
      </button>
      <button
        type="button"
        className={`${isNotButton} ${bottomButton}`}
        onClick={() => {
          setToggleSelectIsOrIsNot(false);
          setShowSelectIsOrIsNot(false);
        }}
        onMouseEnter={handleMouseEnter}
      >
        is not
      </button>
    </div>
  );
};

export default SelectIsOrIsNotDropDownIs;
