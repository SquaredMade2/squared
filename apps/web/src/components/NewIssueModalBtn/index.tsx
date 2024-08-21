import type { FC } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";

import type { NewIssueModalBtnProps } from "./NewIssueModalBtn.interfaces";

const NewIssueModalBtn: FC<NewIssueModalBtnProps> = ({
	className,
	onClick,
	children,
	btnName,
}) => {
	const { theme } = useAppSelector((state) => state.userSettings);

	const defaultClasses =
		"flex items-center px-2 py-1 border border-border rounded cursor-pointer text-card-foreground text-sm shadow-md hover:bg-nav-hover text-sm font-semibold transition-colors ease-in-out duration-300 ";

	const handleBackground = () => {
		return theme === "light"
			? "bg-popover hover:bg-muted"
			: "bg-muted hover:bg-popover";
	};

	return (
		<button
			type="button"
			onClick={onClick}
			className={`${defaultClasses} ${handleBackground()} ${className ? className : ""}`} // Accepts customed classes if needed
		>
			{children}
			<span className="ml-2 cursor-pointer">{btnName}</span>
		</button>
	);
};

export default NewIssueModalBtn;
