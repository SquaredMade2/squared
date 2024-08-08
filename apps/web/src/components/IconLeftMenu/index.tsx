import React from "react";
import ButtonIcon from "../ButtonIcon";
import ViewButton from "../ViewButton";
import LogoutButton from "../LogoutButton";
import ThemeSwitcher from "../ThemSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { useRouter } from "next/navigation";

const IconLeftMenu = () => {
  const router = useRouter();
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);

  const navigateTo = (childRoute: string): void => {
    router.push(`/workspace/${workspace.url}${childRoute}`);
  };

  const iconStyle = "w-full h-12 flex items-center ";
  return (
    <div className="flex flex-col h-full items-center">
      <div className="flex flex-col items-center">
        <div className={iconStyle}>
          <ButtonIcon
            icon={
              <FontAwesomeIcon
                className="text-gray-600 dark:text-gray-400"
                icon={faHouse}
              />
            }
            tooltipLabel={"Home"}
            labelPosition="right"
            handleClick={() => navigateTo("")}
            hoverBg="bg-card"
          />
        </div>
        <div className={iconStyle}>
          <ButtonIcon
            icon={
              <FontAwesomeIcon
                className="text-gray-600 dark:text-gray-400"
                icon={faMagnifyingGlass}
              />
            }
            tooltipLabel={"Search"}
            labelPosition="right"
            handleClick={() => navigateTo("/search")}
            hoverBg="bg-card"
          />
        </div>
        <div className={iconStyle}>
          <ButtonIcon
            icon={
              <FontAwesomeIcon
                className="text-gray-600 dark:text-gray-400"
                icon={faGear}
              />
            }
            tooltipLabel={"Settings"}
            labelPosition="right"
            handleClick={() => navigateTo("/settings/workspace")}
            hoverBg="bg-card"
          />
        </div>
        <div className={iconStyle}>
          <ButtonIcon
            icon={
              <FontAwesomeIcon
                className="text-gray-600 dark:text-gray-400"
                icon={faInbox}
              />
            }
            tooltipLabel={"Inbox"}
            labelPosition="right"
            handleClick={() => navigateTo("/inbox")}
            hoverBg="bg-card"
          />
        </div>
        <div className={iconStyle}>
          <ThemeSwitcher />
        </div>
        <div className={iconStyle}>
          <ViewButton />
        </div>
      </div>
      <div className="mt-auto mb-1">
        <LogoutButton />
      </div>
    </div>
  );
};
export default IconLeftMenu;
