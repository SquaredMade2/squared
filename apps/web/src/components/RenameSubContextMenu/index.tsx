import { useRef, type FocusEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import ProfileImage from "../ProfileImage";
import { RenameSubContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateTitle } from "@/api/taskApi";
import { getAllTasks } from "@/store/taskData/thunks";
import { EventType } from "@/interfaces/event.interfaces";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";

const styles = {
	contentWrapper: "",
	centerIcon: "mr-2",
};

const RenameSubContextMenu: React.FC<RenameSubContextMenuProps> = ({
	task,
}) => {
	const dispatch = useAppDispatch();
    const currentTeam = useAppSelector((state) => state.taskData.currentTeam)

    const renamedTask = useRef('')

    const changeTitle = () => {
        dispatch(updateTitle(renamedTask.current, task._id));
        dispatch(getAllTasks(currentTeam))
    }

    const {
        author,
        storeCommonFields,
        storeType,
        storeTaskValue,
        updateTaskValue,
      } = useLogTaskEvent();

    const logEvent = () => {
        storeType(EventType.TitleUpdated);
        if (task._id !== undefined) storeTaskValue(task.title ?? "");
        updateTaskValue(renamedTask.current ?? "");
      };
    
      const handleChangeTitle = async () => {
        const changeMade: boolean = renamedTask.current !== task.title;
        if (changeMade && task._id !== undefined) {
          storeCommonFields(author, task._id);
          logEvent();
          await dispatch(updateTitle(renamedTask.current, task._id));
          await dispatch(getAllTasks(currentTeam))
        }
      };

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
                Rename
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
                <div className="flex flex-col h-40">
                    <Input className="mx-3 w-40 mt-3" onChange={(e) => renamedTask.current = e.target.value} />
                        <Button type='submit' className="m-auto" onClick={handleChangeTitle}> Change </Button>
                </div>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default RenameSubContextMenu;
