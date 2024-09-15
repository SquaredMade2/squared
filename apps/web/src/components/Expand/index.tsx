import React from "react";
import Link from "next/link";
import ButtonIcon from "../ButtonIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { formatUrl } from "@/utils/formatting";
import { useTaskStore, useTeamStore } from "@/store";

const expandIcon = <FontAwesomeIcon icon={faExpand} />;

const Expand = () => {
	const { currentTask } = useTaskStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const url = `/${currentTeam?.name}/task/${currentTeam?.identifier}/${formatUrl(currentTask?.title ?? "")}`;

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
