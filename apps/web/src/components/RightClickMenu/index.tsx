"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type {
	Color,
	RightClickMenuProps,
} from "@/components/RightClickMenu/RightClickMenu.interfaces";
import { Pencil, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

const RightClickMenu = ({
	x,
	y,
	task,
	setShowRenameModal,
	handleDeleteTaskCard,
}: RightClickMenuProps) => {
	const { theme } = useTheme();
	const [fillColor, setFillColor] = useState<Color>({
		hover: "",
		color: "",
	});

	const handleThemeSVG = (): void => {
		theme === "light"
			? setFillColor({
					hover: "group-hover:fill-black",
					color: "fill-gray-500",
				})
			: setFillColor({
					...fillColor,
					hover: "group-hover:fill-white",
				});
	};

	useEffect(() => {
		handleThemeSVG();
	}, [theme]);

	return (
		//Inline styling on purpose.
		<div
			className=" bg-popover text-popover-foreground fixed border border-border z-10 cursor-default rounded"
			style={{ top: `${y}px`, left: `${x}px` }}
		>
			<div className="w-full h-full p-1.5">
				<ul>
					{setShowRenameModal && (
						<li
							onClick={() => setShowRenameModal(true)}
							className={`${"flex items-center hover:bg-popoverHover py-1 pr-3 pl-1 rounded"} group`}
						>
							<span className="mr-2">
								<Pencil className="size-4" />
							</span>
							<p>Rename...</p>
						</li>
					)}
					<li
						className={`${"flex items-center hover:bg-popoverHover py-1 pr-3 pl-1 rounded"} group`}
						onClick={() => {
							handleDeleteTaskCard(task);
						}}
					>
						<span className="mr-2">
							<Trash2 className="size-4" />
						</span>
						<p>Delete</p>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default RightClickMenu;
