import ButtonIcon from "../ButtonIcon";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";

const ThemeSwitcher: React.FC = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme) {
			setTheme(storedTheme);
		}
	}, []);

	if (!mounted) return null;

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
	};
	const icon = (
		<FontAwesomeIcon icon={theme === "light" ? faMoon : faLightbulb} />
	);

	const tooltip = theme === "light" ? "Dark mode" : "Light mode";

	return (
		<ButtonIcon
			icon={icon}
			tooltipLabel={tooltip}
			labelPosition="right"
			handleClick={toggleTheme}
			hoverBg="bg-card"
		/>
	);
};

export default ThemeSwitcher;
