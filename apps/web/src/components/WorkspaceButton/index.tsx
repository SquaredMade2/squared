import ButtonIcon from "../ButtonIcon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hovercard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import WorkSpaceDropDownContents from "../WorkSpaceDropDownContents";

const WorkspaceButton = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button>
          <ButtonIcon
            icon={
              <FontAwesomeIcon
                className="text-gray-600 dark:text-gray-400"
                icon={faBriefcase}
              />
            }
            hoverBg="bg-card"
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72" side="right">
        <WorkSpaceDropDownContents />
      </HoverCardContent>
    </HoverCard>
  );
};
export default WorkspaceButton;
