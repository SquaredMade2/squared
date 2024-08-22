import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { setView } from "@/store/userSettings";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersVertical } from "lucide-react";
import { Switch } from "../ui/switch";
import {
	setShowPriority,
	setShowLabels,
	setShowDateTime,
} from "@/store/toggleTaskFeatures";
import DisplayPreferences from "../DisplayPreferences";

const TopNavBarDisplay = () => {
	const dispatch = useAppDispatch();
	const view = useAppSelector((state) => state.userSettings.view);
	const { showPriority, showLabels, showDateTime } = useAppSelector(
		(state) => state.toggleTaskFeatures,
	);

	const [dropDownOpen, setDropDownOpen] = useState(false);

	const handleDropDown = (): void => {
		setDropDownOpen(!dropDownOpen);
	};

	const handleClickAway = (): void => {
		setDropDownOpen(false);
	};

	const handleListClick = (): void => {
		dispatch(setView("list"));
	};

	const handleGridClick = (): void => {
		dispatch(setView("grid"));
	};

	const handlePriority = (): void => {
		dispatch(setShowPriority());
	};

	const handleLabels = (): void => {
		dispatch(setShowLabels());
	};

	const handleDateTime = (): void => {
		dispatch(setShowDateTime());
	};

	return (
		<div className="flex flex-col gap-2 items-end relative h-10 hover:bg-accent">
			<div className="group" onClick={handleDropDown}>
				<button
					type="button"
					className="border border-solid border-border rounded flex flex-row gap-2 items-center px-2 h-10 py-0.5 text-sm text-muted-foreground cursor-pointer shadow-md bg-card  hover:bg-accent hover:shadow-lg active:shadow-sm"
				>
					<SlidersVertical className="size-4" />
					<span className="cursor-pointer text-foreground"> Display</span>
					<ChevronDown className="size-4" />
				</button>
			</div>
			<AnimatePresence>
				{dropDownOpen && (
					<ClickAwayListener onClickAway={handleClickAway}>
						<motion.div
							className="bg-popover border border-solid border-border rounded px-4 py-3 shadow transition-opacity duration-300 absolute w-[300px] z-10 top-[41px]"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.1 }}
						>
							<div className="flex flex-row justify-between items-center my-1">
								<span className="text-foreground text-sm">Layout</span>
								<div>
									<button
										type="button"
										onClick={() => {
											handleListClick();
										}}
										className={`bg-popover px-2 mr-1 text-sm ${
											view === "list"
												? "border border-solid border-border rounded bg-purpleButton text-foreground cursor-pointer"
												: "text-popover-foreground cursor-pointer"
										}`}
									>
										List
									</button>
									<button
										type="button"
										onClick={() => {
											handleGridClick();
										}}
										className={`bg-popover px-2 text-sm ${
											view === "grid"
												? "border border-solid border-border rounded bg-purpleButton text-foreground cursor-pointer"
												: "text-foreground cursor-pointer"
										}`}
									>
										Grid
									</button>
								</div>
							</div>
							<span className="w-full border-t border-border block my-1" />

							<DisplayPreferences />
						</motion.div>
					</ClickAwayListener>
				)}
			</AnimatePresence>
		</div>
	);
};

export default TopNavBarDisplay;
