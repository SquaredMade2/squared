import ButtonIcon from "../ButtonIcon";
import { useViewStore } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface ToggleNavBarProps {
	hover?: "bg-accent" | "bg-card";
}
const ToggleNavBar = ({ hover }: ToggleNavBarProps) => {
	const { showNavbar, setShowNavbar } = useViewStore((state) => state);
	const handleNavBar = (): void => {
		setShowNavbar(!showNavbar);
	};

	const toggleIcon = (
		<FontAwesomeIcon icon={showNavbar ? faChevronLeft : faChevronRight} />
	);

	return (
		<div className="md:hidden cursor-pointer mr-2">
			<ButtonIcon
				icon={toggleIcon}
				hoverBg={hover}
				handleClick={handleNavBar}
			/>
		</div>
	);
};

export default ToggleNavBar;
