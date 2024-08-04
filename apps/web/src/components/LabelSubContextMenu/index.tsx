import { LabelSubContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import {
	bugIcon,
	featureIcon,
	highPriority,
	improvementIcon,
	label,
	lowPriority,
	mediumPriority,
	nullPriority,
	redIcon,
	testIcon,
	urgentPriority,
} from "../Svg";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType, Labels } from "@/interfaces/event.interfaces";
import axios from "axios";
import { getSingleTask } from "@/store/task/thunks";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { setLabels, setPriority } from "@/store/taskData";
import { labelOptions, priorityOptions } from "@/constants/designations";
import { getAllTasks } from "@/store/taskData/thunks";

const styles = {
	contentWrapper: "",
	centerIcon: "mr-2",
};

const LabelSubContextMenu: React.FC<LabelSubContextMenuProps> = ({ task }) => {
	const dispatch = useAppDispatch();

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const newIssueLabels = useAppSelector((state) => state.taskData.labels);

	const {
		author,
		storeCommonFields,
		storeType,
		storeTaskLabels,
		updateTaskLabels,
	} = useLogTaskEvent();

	const renderLabelIcon = (label: string) => {
		switch (label) {
			case "Bug":
				return bugIcon();
			case "Feature":
				return featureIcon();
			case "Improvement":
				return improvementIcon();
			case "Red":
				return redIcon();
			case "Test":
				return testIcon();
			default:
				return null;
		}
	};

	const updateItem = async (newLabelSelection: string[]) => {
		if (task._id !== undefined) {
			try {
				await axios.put(
					`${process.env.NEXT_PUBLIC_SERVER}/task/update/${task._id}`,
					{
						labels: newLabelSelection,
					},
				);
				dispatch(getSingleTask(task._id));
			} catch (err) {}
		}
	};

	const logEvent = (newLabels: string[]) => {
		storeType(EventType.LabelsUpdated);
		if (task.labels) {
			updateTaskLabels(newLabels as Labels[]);
		}
	};

	const newLabelSelection = (currentLabels: string[], labelName: string) => {
		let newSelection = [];
		if (currentLabels.length === 0) {
			newSelection = [labelName];
		} else {
			const nameFound = currentLabels.find((current) => current === labelName);
			if (nameFound) {
				newSelection = currentLabels.filter((current) => current !== labelName);
			} else {
				newSelection = [...currentLabels, labelName];
			}
		}
		return newSelection;
	};

	const handleSelectLabels = (labelName: string) => {
		let newLabelsSelected = [];
		newLabelsSelected = newLabelSelection(newIssueLabels, labelName);
		if (task.labels) {
			newLabelsSelected = newLabelSelection(task.labels, labelName);
			if (task._id !== undefined) storeCommonFields(author, task._id);
			logEvent(newLabelsSelected);
			updateItem(newLabelsSelected);
			dispatch(getAllTasks(currentTeam));
		}
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className={styles.centerIcon}>{label()}</div>
				Label
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{labelOptions.map((label) => {
					return (
						<ContextMenuItem onClick={() => handleSelectLabels(label)}>
							<div className={styles.centerIcon}>{renderLabelIcon(label)}</div>
							{label}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default LabelSubContextMenu;
