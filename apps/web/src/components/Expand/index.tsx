import React from "react";
import Link from "next/link";
import ButtonIcon from "../ButtonIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { formatUrl } from "@/utils/formatting";

const expandIcon = <FontAwesomeIcon icon={faExpand} />;

const Expand = () => {
	const title = useAppSelector((state) => state.taskData.taskPage.title);
	const { currentTeam } = useAppSelector((state) => state.taskData);
	const url = `/${currentTeam.name}/task/${currentTeam.identifier}/${formatUrl(title)}`;

	return (
		<Link href={url}>
			<ButtonIcon
				icon={expandIcon}
				tooltipLabel="Expand"
				labelPosition="left"
				hoverBg="bg-accent"
			/>
		</Link>
	);
};

export default Expand;
