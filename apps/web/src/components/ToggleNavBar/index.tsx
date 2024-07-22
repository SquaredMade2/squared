import React from 'react';
import ButtonIcon from '../ButtonIcon';
import { navBarToggle } from '@/store/userSettings';
import { useAppSelector, useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { toggleNavBar } from '@/components/Svg';

const ToggleNavBar = () => {
  const { showNavBar } = useAppSelector((state) => state.userSettings);
  const dispatch = useAppDispatch();
  const handleNavBar = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  return <ButtonIcon icon={toggleNavBar({})} hoverBg="bg-accent" handleClick={handleNavBar} />;
};

export default ToggleNavBar;
