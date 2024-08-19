import ButtonIcon from "../ButtonIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchButton = ({
	setIsSearchCommand,
}: {
	setIsSearchCommand: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const handleClick = (): void => {
		setIsSearchCommand((open: boolean) => !open);
	};
	return (
		<ButtonIcon
			icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
			tooltipLabel={"Search"}
			labelPosition="right"
			handleClick={handleClick}
			hoverBg="bg-card"
		/>
	);
};

export default SearchButton;
