import React from "react";
import ButtonIcon from "../ButtonIcon";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { setView } from "@/store/userSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCellsLarge, faListUl } from "@fortawesome/free-solid-svg-icons";

const ViewButton = () => {
	const dispatch = useAppDispatch();
	const { view } = useAppSelector((state) => state.userSettings);
	const switchView = () => {
		view === "list" ? dispatch(setView("grid")) : dispatch(setView("list"));
	};
	const icon = (
		<FontAwesomeIcon icon={view === "list" ? faTableCellsLarge : faListUl} />
	);

	const tooltip = view === "list" ? "Grid View" : "List View";

	return (
		<ButtonIcon
			icon={icon}
			handleClick={switchView}
			tooltipLabel={tooltip}
			labelPosition="right"
			hoverBg="bg-card"
		/>
	);
};

export default ViewButton;
