import type React from "react";
import { useState, useEffect } from "react";
import { SVGProps } from "react";

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
	};
	return (
		<div>
			<button
				type="button"
				onClick={handleMenu}
				className="relative border max-w-[220px] items-center rounded-md p-0.5 flex gap-2"
			>
				{Icon}
				{title}
			</button>
			<menu
				className={`absolute ${openMenu ? "flex" : "hidden"} flex-col top-[318px] border rounded-md bg-red-500`}
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
