import {
	useFilterStore,
	useTaskStore,
	useUserStore,
	useViewStore,
} from "@/store";
import { orderTasks } from "@/utils/compareSorting";
import { Droppable } from "@hello-pangea/dnd";
import type { Task } from "@squaredmade/db";
import { usePathname } from "next/navigation";
import TaskCard from "../TaskCard";

const Group = ({
	tasks,
	isListView,
}: {
	tasks: Task[];
	isListView: boolean;
}) => {
	const { displayOptions } = useViewStore((state) => state);

	const { orderBy, orderAscending } = displayOptions.taskOrder;
	const { showSubTasks } = displayOptions;
	const { tasks: allTasks, allBlockedTaskIds } = useTaskStore((state) => state);
	const users = useUserStore((state) => state.users);
	const pathname = usePathname();

	const { savedFilters } = useFilterStore((state) => state);

	const currentSavedFilter = pathname.split("/").includes("views")
		? savedFilters.filter((filter) => {
				const filterSlugArray = filter.id.split("-");
				const filterSlug = filterSlugArray[0];

				const pathNameSlug = pathname.split("-").pop();

				return filterSlug === pathNameSlug;
			})[0]
		: null;

	// Get parent task IDs for this group
	const getParentTaskIds = () => {
		const taskIdsForGroup = tasks.map((t) => t.id);
		return tasks
			.filter(
				(t) => t.parentId !== null && taskIdsForGroup.includes(t.parentId),
			)
			.map((t) => t.parentId);
	};

	const renderTask = (task: Task, index: number) => (
		<div
			key={task.id}
			className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
		>
			<TaskCard
				task={task}
				index={index}
				location="dashboard"
				isDisabled={!!allBlockedTaskIds.find((id) => id === task.id)}
			/>
		</div>
	);

	const renderTaskWithSubtasks = (
		task: Task,
		index: number,
		subtasks: Task[],
	) => (
		<div
			key={task.id}
			className={`mb-2 last:mb-0 ${isListView ? "w-full rounded-b-lg" : "w-72"}`}
		>
			<TaskCard
				task={task}
				index={index}
				location="dashboard"
				isDisabled={!!allBlockedTaskIds.find((id) => id === task.id)}
			/>
			{subtasks.length > 0 && showSubTasks && (
				<Droppable droppableId={`${task.identifier}Subtasks`}>
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className={`mt-1 bg-secondary dark:bg-secondary/30 ${
								isListView
									? "w-full rounded-b-lg px-2 pb-2"
									: "w-72 rounded-lg p-2"
							}`}
						>
							{subtasks
								.toSorted((a, b) => a.order - b.order)
								.map((subtask, subIndex) => (
									<TaskCard
										key={subtask.id}
										task={subtask}
										index={subIndex}
										location="dashboard"
										isSubtask={true}
										isDisabled={
											!!allBlockedTaskIds.find((id) => id === subtask.id)
										}
									/>
								))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			)}
		</div>
	);

	const renderSubtasks = (parentTask: Task | undefined, subtasks: Task[]) => (
		<div
			key={parentTask?.id}
			className={`mt-1 bg-secondary dark:bg-secondary/30 ${
				isListView ? "w-full rounded-b-lg px-2 py-2 " : "w-72 rounded-lg p-2"
			}`}
		>
			<span
				className={`inline-block max-w-[250px] truncate text-accent-foreground ${isListView ? "ml-10" : "ml-2"}`}
			>
				{parentTask?.identifier}: {parentTask?.title}
			</span>
			{showSubTasks &&
				subtasks.map((subtask, index) => (
					<TaskCard
						key={subtask.id}
						task={subtask}
						index={index}
						location="dashboard"
						isSubtask={true}
						isDisabled={!!allBlockedTaskIds.find((id) => id === subtask.id)}
					/>
				))}
		</div>
	);

	const parentIdsForGroup = getParentTaskIds();
	const subtaskParentIds = new Set(
		tasks.filter((t) => t.parentId).map((t) => t.parentId),
	);

	// Separate parent tasks and subtasks
	const parentTasks = tasks.filter((task) => !task.parentId);
	const subtasks = tasks.filter((task) => task.parentId);

	const renderableItems = parentTasks.map((task) => {
		const isParentTask = parentIdsForGroup.includes(task.id);
		if (isParentTask) {
			const taskSubtasks = subtasks.filter((t) => t.parentId === task.id);
			return {
				task,
				render: (index: number) =>
					renderTaskWithSubtasks(task, index, taskSubtasks),
			};
		}
		return {
			task,
			render: (index: number) => renderTask(task, index),
		};
	});

	// Handle orphaned subtasks (those without a parent in the current group)
	const orphanedSubtaskGroups = displayOptions.showSubTasks
		? Array.from(subtaskParentIds)
				.map((id) => {
					if (parentIdsForGroup.includes(id)) return null;
					const parentTask = allTasks.find((t) => t.id === id);
					const taskSubtasks = subtasks.filter((t) => t.parentId === id);
					return {
						task: parentTask,
						render: () => renderSubtasks(parentTask, taskSubtasks),
					};
				})
				.filter(Boolean)
		: [];

	// If showSubTasks is false, only include parent tasks for rendering
	const allItems = showSubTasks
		? [...renderableItems, ...orphanedSubtaskGroups]
		: [...renderableItems];

	// Sort all items by the requested order
	const sortedItems = orderTasks(
		allItems
			.map((item) => item?.task)
			.filter((task): task is Task => task !== undefined),
		users,
		orderBy,
		orderAscending,
	);

	// Filter by sprint if a saved filter with sprintId is active
	if (currentSavedFilter) {
		const sprintId = currentSavedFilter.sprintId;

		// if no sprintId then render all tasks
		if (!sprintId) {
			return sortedItems.map((sortedTask, index) => {
				const item = allItems.find((item) => {
					return item?.task?.id === sortedTask.id;
				});
				return item?.render(index);
			});
		}
		// else render items with matching sprintId
		return sortedItems.map((sortedTask, index) => {
			const item = allItems.find((item) => {
				return (
					item?.task?.id === sortedTask.id && item?.task.sprintId === sprintId
				);
			});
			return item?.render(index);
		});
	}

	// Render the sorted items
	return sortedItems.map((sortedTask, index) => {
		const item = allItems.find((item) => {
			return item?.task?.id === sortedTask.id;
		});
		return item?.render(index);
	});
};

export default Group;
