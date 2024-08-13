"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { RenameModalProps } from "@/components/RenameModal/RenameModal.interfaces";
import type { InputChangeEvent, FormSubmitEvent } from "@/types";
import { Pencil } from "lucide-react";
import { getAllTasks } from "@/store/taskData/thunks";
import { useTheme } from "next-themes";
import { useSquaredStore } from "@/storeZ/provider";

const RenameModal = ({
	showRenameModal,
	setShowRenameModal,
	taskData,
	searchSubmit,
}: RenameModalProps) => {
	const dispatch = useAppDispatch();
	const { updateTask } = useSquaredStore((state) => state.tasks);

	const [inputValue, setInputValue] = useState<string>("");
	const { theme } = useTheme();
	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
	const [fillColor, setFillColor] = useState<string>("");

	const modalRef = useRef<HTMLFormElement | null>(null);

	const handleChange = (e: InputChangeEvent): void => {
		setInputValue(e.target.value);
	};

	const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
		e.preventDefault();
		if (inputValue !== taskData?.title) {
			await updateTask(taskData._id, { title: inputValue.trim() });
			dispatch(getAllTasks(currentTeam));
			if (searchSubmit) {
				searchSubmit(e);
			}
			setShowRenameModal(false);
		}
	};

	const handleThemeSVG = (): void => {
		theme === "light"
			? setFillColor("fill-black")
			: setFillColor("fill-gray-500");
	};

	useEffect(() => {
		function handleClickAway(event: MouseEvent): void {
			if (
				modalRef.current &&
				event.target instanceof Node &&
				!modalRef.current.contains(event.target)
			) {
				setInputValue(taskData?.title);
				setShowRenameModal(false);
			}
		}
		document.addEventListener("mousedown", handleClickAway);
		return () => {
			document.removeEventListener("mousedown", handleClickAway);
		};
	}, [taskData]);

	useEffect(() => {
		setInputValue(taskData?.title);
	}, [taskData]);

	useEffect(() => {
		handleThemeSVG();
	}, [theme]);

	const { title } = taskData ?? {};

	return (
		<>
			{showRenameModal && (
				<div className="w-full mdsm:w-full flex justify-center z-40">
					<form
						ref={modalRef}
						className="w-[640px] xs:w-[calc(100%-10px)] border border-border fixed top-1/4 bg-popover rounded-lg text-foreground shadow-[#00000080] shadow-[0px_16px_70px] z-40"
						onSubmit={handleSubmit}
					>
						<div className="px-5">
							<h2 className="bg-popoverHover inline-block px-3 py-0.5 rounded mt-5 text-sm">
								{title}
							</h2>
							<input
								type="text"
								className="bg-popover focus:outline-none py-5 block text-lg w-full"
								value={inputValue}
								onFocus={(e) => e.target.select()}
								spellCheck="false"
								placeholder="Rename..."
								onChange={handleChange}
							/>
						</div>
						<div className="p-1.5 border-t border-border">
							<button
								className="bg-popoverHover rounded pl-3.5 py-2.5 flex items-center whitespace-nowrap overflow-hidden text-sm w-full"
								type="button"
							>
								<span className="mr-2.5">
									<Pencil className="size-4" />
								</span>
								<p>
									Rename issue to{" "}
									<span className="text-muted-foreground">{`"${inputValue}"`}</span>
								</p>
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
};

export default RenameModal;
