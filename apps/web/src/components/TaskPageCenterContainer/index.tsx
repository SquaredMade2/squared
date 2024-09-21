import EventTabs from "../TaskPageActivityTimeline/EventTabs";
import TaskPageTitle from "@/components/taskPageTitle/index";
import TaskCardTop from "@/components/TaskCardTop";
import ButtonIcon from "../ButtonIcon";
import BackButton from "../BackButton";
import type { TaskPageCenterContainerProps } from "./TaskPageCenterContainer.interfaces";
import { ScrollArea } from "../ui/scroll-area";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

const TaskPageCenterContainer = ({
	setShowSideNav,
}: TaskPageCenterContainerProps) => {
	const path = usePathname();
	const inboxPath = path.includes("/inbox");
	return (
		<div className="w-full snap-start z-0 overflow-x-hidden">
			<div className="flex items-center gap-2">
				{!inboxPath && (
					<div>
						<BackButton hoverbackground="bg-card" />
					</div>
				)}
				<div className=" w-full max850:w-10/12 overflow-hidden">
					<TaskCardTop />
				</div>
				<span
					onClick={setShowSideNav}
					className="hidden max850:block max850:absolute max850:right-0 cursor-pointer"
				>
					<ButtonIcon
						icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
						hoverBg="bg-accent"
					/>
				</span>
			</div>

			<ScrollArea className="h-[calc(100vh-5rem)] ">
				<div className="mr-1 max850:mr-1 md:mr-5 xl:mr-10">
					<TaskPageTitle />
					<EventTabs />
				</div>
			</ScrollArea>
		</div>
	);
};

export default TaskPageCenterContainer;
