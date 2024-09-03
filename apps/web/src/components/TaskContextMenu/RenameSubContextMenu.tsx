import { type ChangeEvent, type FC, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import {
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import type { RenameSubContextMenuProps } from "@/components/TaskContextMenu/ContextMenu.interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateTitle } from "@/api/taskApi";
import { getAllTasks } from "@/store/taskData/thunks";
import { EventType } from "@/interfaces/event.interfaces";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";

const RenameSubContextMenu: FC<RenameSubContextMenuProps> = ({ task }) => {
	const dispatch = useAppDispatch();
	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const renamedTask = useRef("");

	const {
		author,
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
	} = useLogTaskEvent();

	const logEvent = () => {
		storeType(EventType.TitleUpdated);
		if (task.id !== undefined) storeTaskValue(task.title ?? "");
		updateTaskValue(renamedTask.current ?? "");
	};

	const handleChangeTitle = async () => {
		const changeMade: boolean = renamedTask.current !== task.title;
		if (changeMade && task.id !== undefined) {
			storeCommonFields(author, task.id);
			logEvent();
			await dispatch(updateTitle(renamedTask.current, task.id));
			await dispatch(getAllTasks(currentTeam));
		}
	};

	const updateRenamedTask: (e: ChangeEvent<HTMLInputElement>) => void = (e) => {
		renamedTask.current = e.target.value;
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>Rename</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				<div className="flex flex-col h-40">
					<Input
						className="mx-3 w-40 mt-3"
						onChange={(e) => updateRenamedTask(e)}
					/>
					<Button type="submit" className="m-auto" onClick={handleChangeTitle}>
						{" "}
						Change{" "}
					</Button>
				</div>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default RenameSubContextMenu;
