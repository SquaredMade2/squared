import React, { useState } from "react";
import ButtonIcon from "../ButtonIcon";
import LogoutButton from "../LogoutButton";
import ThemeSwitcher from "../ThemeSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faInbox, faHouse } from "@fortawesome/free-solid-svg-icons";
import { useRouter, usePathname } from "next/navigation";
import SearchButton from "../SearchButton";
import SearchCommand from "../SearchCommand";
import { useWorkspaceStore } from "@/store";

const IconLeftMenu = () => {
	const router = useRouter();
	const currentRoute = usePathname();
	const { currentWorkspace: workspace } = useWorkspaceStore((state) => state);
	const baseUrl = process.env.NEXT_PUBLIC_URL;
	const [isSearchCommand, setIsSearchCommand] = useState<boolean>(false);
	const homeRoute = currentRoute.includes(`${workspace?.url}`);
	const viewsRoute = currentRoute.includes("/views");
	const iconStyle = "w-full h-12 flex items-center ";

	const navigateTo = (childRoute: string): void => {
		router.push(`${baseUrl}/${childRoute}`);
	};
	const toHome = () => {
		homeRoute && !viewsRoute ? "" : router.back();
	};

	return (
		<div className="flex flex-col h-full items-center w-full">
			<div className="flex flex-col items-center">
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
