"use client";
import "@/app/globals.css";
import ButtonIcon from "../ButtonIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import Notificationcontrols from "../NotificationControls";
import BackButton from "../BackButton";
import { useTaskStore } from "@/storeZ";

const inboxIcon = <FontAwesomeIcon icon={faBarsStaggered} />;
type Props = {
	toggleInboxList: () => void;
};
const InboxTopMenu: React.FC<Props> = ({ toggleInboxList }) => {
	const { currentTaskId } = useTaskStore((state) => state);

	return (
		<div className="w-full h-10 flex justify-between bg-popover py-2 border-b text-foreground sticky top-0 z-10">
			<div className="w-80 lg:px-1 flex gap-2 items-center">
				<BackButton hoverbackground="bg-accent" />
				<div className="xl:hidden ml-1" onClick={toggleInboxList}>
					<ButtonIcon
						icon={inboxIcon}
						tooltipLabel="Inbox"
						labelPosition="right"
						hoverBg="bg-accent"
					/>
				</div>
				<p className="hidden xl:block">Inbox</p>
			</div>
			<div className="flex items-center">
				{currentTaskId !== null && <Notificationcontrols />}
			</div>
		</div>
	);
};
export default InboxTopMenu;
