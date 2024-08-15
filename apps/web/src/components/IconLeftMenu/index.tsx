import React from "react";
import ButtonIcon from "../ButtonIcon";
import ViewButton from "../ViewButton";
import LogoutButton from "../LogoutButton";
import ThemeSwitcher from "../ThemeSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { useRouter, usePathname } from "next/navigation";
import ToggleNavBar from "../ToggleNavBar";
import TeamsButton from "../TeamsButton";
import WorkspaceButton from "../WorkspaceButton";
import { SideNavNewIssueButton } from "../NewIssueButton";

const IconLeftMenu = () => {
  const router = useRouter();
  const currentRoute = usePathname();
  const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
  const { showNavBar } = useAppSelector((state) => state.userSettings);

  const checkRouteIncludes = (pathname: string, ...args: string[]): boolean => {
    return args.some((arg) => pathname.includes(arg));
  };

  const navigateTo = (childRoute: string): void => {
    currentRoute.includes("/all") && childRoute === ""
      ? ""
      : router.push(`/workspace/${workspace.url}${childRoute}`);
  };

  const homeRoute = checkRouteIncludes(currentRoute, "/team");

  const iconStyle = "w-full h-12 flex items-center ";
  return (
    <div className="flex flex-col h-full items-center w-full">
      <div className="flex flex-col items-center">
        {homeRoute && (
          <div className={iconStyle}>
            <ToggleNavBar hover="bg-card" />
          </div>
        )}
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
        {!showNavBar && homeRoute && (
          <>
            <div className={iconStyle}>
              <WorkspaceButton />
            </div>
            <div className={iconStyle}>
              <TeamsButton />
            </div>
            <div className={iconStyle}>
              <SideNavNewIssueButton />
            </div>
          </>
        )}

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
        {homeRoute && (
          <div className={iconStyle}>
            <ViewButton />
          </div>
        )}
        <div className={iconStyle}>
          <ThemeSwitcher />
        </div>
      </div>
      <div className="mt-auto mb-1">
        <LogoutButton />
      </div>
    </div>
  );
};
export default IconLeftMenu;
