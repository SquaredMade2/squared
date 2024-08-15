import React from "react";
import ButtonIcon from "../ButtonIcon";
import { navBarToggle } from "@/store/userSettings";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const ToggleNavBar = (hover: { hover?: string }) => {
  const { showNavBar } = useAppSelector((state) => state.userSettings);
  const dispatch = useAppDispatch();
  const handleNavBar = (): void => {
    //const navBarValue = !showNavBar;
    dispatch(navBarToggle(!showNavBar));
  };
  const toggleIcon = !showNavBar ? (
    <FontAwesomeIcon icon={faChevronRight} />
  ) : (
    <FontAwesomeIcon icon={faChevronLeft} />
  );
  const lable = showNavBar ? "Hide Navbar" : "Show Navbar";
  const hoverBg = hover || "bg-card";
  return (
    <ButtonIcon
      icon={toggleIcon}
      hoverBg={hoverBg as string}
      handleClick={handleNavBar}
    />
  );
};

export default ToggleNavBar;
