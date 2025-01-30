import type React from "react";
import { useEffect, useState } from "react";

type Props = {
	// Icon: React.FC<React.SVGProps<SVGSVGElement>>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	options: Record<any, any>[];
};

export const NewTaskDropDown = ({ options }: Props) => {
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
				className="relative flex max-w-[220px] items-center gap-2 rounded-md border border-[#2b2c3b] bg-background-darkSecondary p-0.5"
			>
				{Icon}
				{title}
			</button>
			<menu
				className={`absolute ${openMenu ? "flex" : "hidden"} top-[318px] flex-col rounded-md border border-[#2b2c3b] bg-background-darkSecondary`}
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
