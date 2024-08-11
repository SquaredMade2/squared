"use client";
import type React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  ChevronLeft,
  CircleUser,
  Plus,
  Users,
} from "lucide-react";
import { setCurrentTeam } from "@/store/taskData";
import type { RootState } from "@/store";
import type { handleTeamClickNavbar } from "@/app/interfaces/Navbars.interfaces";
import type { Team } from "@/store/taskData/taskData.interfaces";
import type { SettingsNavbarProps } from "./SettingsNavBarProps";
import { useTheme } from "next-themes";

const styles = {
  main: "bg-accent border border-border min-w-[296px] min-h-screen h-full flex flex-col",
  inviteDiv: "flex flex-col items-center pb-6 text-foreground",
  title: "text-xl flex items-center py-6",
  backSvg: "h-3 mr-3 hover:cursor-pointer",
  addTeam: "flex items-center justify-center p-1 ml-3 rounded",
  teamSvg: "mr-2 rounded p-1 cursor-pointer",
  settingText: "text-foreground cursor-pointer",
  generalButton: "flex w-24 ml-6 p-0.5 cursor-pointer",
  membersButton: "flex w-24 ml-6 p-0.5 cursor-pointer",
  integrationsButton: "flex w-32 ml-6 mb-4 p-0.5 cursor-pointer",
  myAccountDiv: "mb-1 pl-0.5 flex items-center",
  myWorkspaceDiv: "mb-1 pl-0.5 flex items-center",
  myAccountText: "text-muted-foreground pl-2",
  profileButton: "rounded flex w-24 ml-6  p-0.5",
  teamsDiv: "pt-5 pb-1 flex items-center",
  teamsDivText: "text-muted-foreground pl-2",
  teamsLi: "rounded flex p-0.5 ml-6 cursor-pointer",
  lightButton: "pt-10 flex w-full justify-center pr-5",
  darkButton: "rounded p-1 cursor-pointer",
  pointer: "cursor-pointer",
};

const SettingsNavBar = ({
  setLoading,
}: SettingsNavbarProps): React.ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { setTheme } = useTheme();

  const workspace = useSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );

  const baseUrl = `/workspace/${workspace.url}/settings`;
  const teamUrl = `${baseUrl}/teams`;
  const addTeamUrl = `${baseUrl}/new-team`;
  const profileUrl = `${baseUrl}/profile`;
  const generalUrl = `${baseUrl}/workspace`;
  const membersUrl = `${baseUrl}/members`;
  const integrationsUrl = `${baseUrl}/integrations`;

  const handleTeamClick: handleTeamClickNavbar = (team: Team) => {
    if (setLoading) {
      setLoading(true);
    }
    dispatch(setCurrentTeam(team));
    router.push(`${teamUrl}/${team.identifier}`);
  };

  return (
    <div className="bg-accent border border-border min-w-[296px] min-h-screen h-full flex flex-col">
      <div className="flex flex-col items-center pb-6 text-foreground">
        <div>
          <div
            className="text-xl flex items-center py-6"
            onClick={() => router.push(`/workspace/${workspace.url}`)}
          >
            <span className="h-3 mr-3 hover:cursor-pointer">
              <ChevronLeft className="size-4 text-[#6b6f75] cursor-pointer" />
            </span>
            <h1 className="text-foreground cursor-pointer">
              Settings
            </h1>
          </div>
          <div className="mb-1 pl-0.5 flex items-center">
            <BriefcaseBusiness className="size-4 text-[#6A6F75]" />
            <p className="text-muted-foreground pl-2">Workspace</p>
          </div>
          <button
            type="button"
            className="flex w-24 ml-6 p-0.5 cursor-pointer"
            onClick={() => router.push(generalUrl)}
          >
            <p>General</p>
          </button>
          <button
            type="button"
            onClick={() => router.push(membersUrl)}
            className="flex w-24 ml-6 p-0.5 cursor-pointer"
          >
            Members
          </button>
          <button
            type="button"
            onClick={() => router.push(integrationsUrl)}
            className={styles.integrationsButton}
          >
            Integrations
          </button>
          <div className="mb-1 pl-0.5 flex items-center">
            <CircleUser className="size-4 text-[#6A6F75]" />
            <p className="text-muted-foreground pl-2">My Account</p>
          </div>
          <div>
            <button
              type="button"
              className="rounded flex w-24 ml-6  p-0.5"
              onClick={() => router.push(profileUrl)}
            >
              <p className="cursor-pointer">Profile</p>
            </button>
          </div>
          <div className="pt-5 pb-1 flex items-center">
            <Users className="size-4 text-[#858699]" />
            <p className="text-muted-foreground pl-2">Teams</p>
          </div>
          {workspace && (
            <ul>
              {workspace?.teams?.map((team) => (
                <li
                  key={team._id}
                  onClick={() => handleTeamClick(team)}
                  className="rounded flex p-0.5 ml-6 cursor-pointer"
                >
                  {team.name}
                </li>
              ))}
            </ul>
          )}
          <div
            className="flex items-center justify-center p-1 ml-3 rounded"
            onClick={() => router.push(addTeamUrl)}
          >
            <span className="mr-2 rounded p-1 cursor-pointer">
              <Plus className="size-5 cursor-pointer" />
            </span>
            <p className="cursor-pointer">Add team</p>
          </div>
          <div className="pt-10 flex w-full justify-center pr-5">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className="mr-2 rounded p-1 cursor-pointer"
            >
              Light
            </button>
            <button
              type="button"
              className="rounded p-1 cursor-pointer"
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNavBar;
