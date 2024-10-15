import type React from "react";
import { useState, useEffect } from "react";

type Props = {
	// Icon: React.FC<React.SVGProps<SVGSVGElement>>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	options: Record<any, any>[];
};

export const NewIssueDropDown = ({ options }: Props) => {
	const [openMenu, setOpenMenu] = useState(false);
	const [title, setTitle] = useState("");
	const [Icon, setIcon] = useState(() => <div>{}</div>);

	useEffect(() => {
		setTitle(options[0].value);
		setIcon(options[0].icon);
	}, [options]);

	const handleMenu = () => {
		setOpenMenu(!openMenu);
	};

	const handleSelection = (e: React.MouseEvent) => {
		setTitle(options[Number(e.currentTarget.id)].value);

		setIcon(options[Number(e.currentTarget.id)].icon);
	};
	return (
		<div>
			<button
				type="button"
				onClick={handleMenu}
				className="relative bg-background-darkSecondary border border-[#2b2c3b] max-w-[220px] items-center rounded-md p-0.5 flex gap-2"
			>
				{Icon}
				{title}
			</button>
			<menu
				className={`absolute ${openMenu ? "flex" : "hidden"} flex-col top-[318px] border-[#2b2c3b] border rounded-md bg-background-darkSecondary`}
			>
				{options.map((option) => {
					return (
						<button
							type="button"
							onClick={handleSelection}
							id={option.id}
							key={option.id}
							className="flex items-center gap-2"
						>
							{<option.icon />}
							{option.value}
						</button>
					);
				})}
			</menu>
		</div>
	);
};
