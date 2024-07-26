import React from "react";
import ButtonIcon from "../ButtonIcon";
import { navBarToggle } from "@/store/userSettings";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { PanelLeft } from "lucide-react";

const ToggleNavBar = () => {
  const { showNavBar } = useAppSelector((state) => state.userSettings);
  const dispatch = useAppDispatch();
  const handleNavBar = (): void => {
    const navBarValue = !showNavBar;
    dispatch(navBarToggle(navBarValue));
  };

  return (
    <ButtonIcon
      icon={<PanelLeft className="text-[#6B6F76] size-5" />}
      hoverBg="bg-accent"
      handleClick={handleNavBar}
    />
  );
};

export default ToggleNavBar;
