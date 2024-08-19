import ButtonIcon from "../ButtonIcon";
import { navBarToggle } from "@/store/userSettings";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface ToggleNavBarProps {
	hover?: "bg-accent" | "bg-card";
}

const ToggleNavBar: React.FC<ToggleNavBarProps> = ({ hover }) => {
	const { showNavBar } = useAppSelector((state) => state.userSettings);
	const dispatch = useAppDispatch();

	const handleNavBar = (): void => {
		dispatch(navBarToggle(!showNavBar));
	};

	const toggleIcon = (
		<FontAwesomeIcon icon={showNavBar ? faChevronLeft : faChevronRight} />
	);

	const label = showNavBar ? "Hide Navbar" : "Show Navbar";

	return (
		<ButtonIcon icon={toggleIcon} hoverBg={hover} handleClick={handleNavBar} />
	);
};

export default ToggleNavBar;
