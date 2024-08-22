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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

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
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={"outline"}>
						<SlidersVertical className="size-4" />
						Display
						<ChevronDown className="size-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="flex flex-col">
						<div className=" w-full items-center justify-between flex mb-3">
							<span className="text-foreground text-sm">Layout</span>
							<div className="flex gap-2 items-center">
								<Button
									type="button"
									onClick={() => {
										handleListClick();
									}}
									variant={view === "list" ? "outline" : "ghost"}
								>
									List
								</Button>
								<Button
									type="button"
									onClick={() => {
										handleGridClick();
									}}
									variant={view === "grid" ? "outline" : "ghost"}
								>
									Grid
								</Button>
							</div>
						</div>
						<DisplayPreferences />
					</div>
				</PopoverContent>
				<span className="w-full border-t border-border block my-1" />
			</Popover>
		</div>
	);
};

export default TopNavBarDisplay;
