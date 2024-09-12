import ButtonIcon from "../ButtonIcon";
import { useViewStore } from "@/storeZ";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface ToggleNavBarProps {
	hover?: "bg-accent" | "bg-card";
}
const ToggleNavBar: React.FC<ToggleNavBarProps> = ({ hover }) => {
	const { showNavbar, setShowNavbar } = useViewStore((state) => state);
	const handleNavBar = (): void => {
		setShowNavbar(!showNavbar);
	};

	const toggleIcon = (
		<FontAwesomeIcon icon={showNavbar ? faChevronLeft : faChevronRight} />
	);

	return (
		<ButtonIcon icon={toggleIcon} hoverBg={hover} handleClick={handleNavBar} />
	);
};

export default ToggleNavBar;
