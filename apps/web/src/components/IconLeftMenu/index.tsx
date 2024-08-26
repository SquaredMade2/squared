import React, { useState } from "react";
import ButtonIcon from "../ButtonIcon";
import ViewButton from "../ViewButton";
import LogoutButton from "../LogoutButton";
import ThemeSwitcher from "../ThemeSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faInbox, faHouse } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { useRouter, usePathname } from "next/navigation";
import ToggleNavBar from "../ToggleNavBar";
import WorkspaceButton from "../WorkspaceButton";
import { SideNavNewIssueButton } from "../NewIssueButton";
import SearchButton from "../SearchButton";
import SearchCommand from "../SearchCommand";

const IconLeftMenu = () => {
	const router = useRouter();
	const currentRoute = usePathname();
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
	const { showNavBar } = useAppSelector((state) => state.userSettings);
	const baseUrl = process.env.NEXT_PUBLIC_URL;
	const [isSearchCommand, setIsSearchCommand] = useState<boolean>(false);

	const navigateTo = (childRoute: string): void => {
		router.push(`${baseUrl}/${childRoute}`);
	};
	const toHome = () => {
		homeRoute && !viewsRoute ? "" : navigateTo(`${workspace.url}`);
	};

	const homeRoute = currentRoute.includes(`${workspace.url}`);
	const viewsRoute = currentRoute.includes("/views");

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
						icon={<FontAwesomeIcon icon={faHouse} />}
						tooltipLabel={"Home"}
						labelPosition="right"
						handleClick={toHome}
						hoverBg="bg-card"
					/>
				</div>
				<div className={iconStyle}>
					<SearchButton setIsSearchCommand={setIsSearchCommand} />
					<SearchCommand
						isSearchCommand={isSearchCommand}
						setIsSearchCommand={setIsSearchCommand}
					/>
				</div>
				{!showNavBar && homeRoute && (
					<>
						<div className={iconStyle}>
							<WorkspaceButton />
						</div>

						<div className={iconStyle}>
							<SideNavNewIssueButton />
						</div>
					</>
				)}

				<div className={iconStyle}>
					<ButtonIcon
						icon={<FontAwesomeIcon icon={faGear} />}
						tooltipLabel={"Settings"}
						labelPosition="right"
						handleClick={() => navigateTo("settings/workspace")}
						hoverBg="bg-card"
					/>
				</div>
				<div className={iconStyle}>
					<ButtonIcon
						icon={<FontAwesomeIcon icon={faInbox} />}
						tooltipLabel={"Inbox"}
						labelPosition="right"
						handleClick={() => navigateTo("inbox")}
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
