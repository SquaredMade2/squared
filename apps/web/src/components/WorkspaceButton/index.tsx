import ButtonIcon from "../ButtonIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";

const WorkspaceButton = () => {
	return (
		<ButtonIcon
			icon={<FontAwesomeIcon icon={faBriefcase} />}
			hoverBg="bg-card"
			labelPosition="right"
			tooltipLabel={"Workspace"}
		/>
	);
};
export default WorkspaceButton;
