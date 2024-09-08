"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import ViewAllTasks from "@/components/ViewAllTasks";
import type { FilterOption } from "@/app/interfaces/Filter.interfaces";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@repo/db";
import { useTaskStore, useTeamStore } from "@/storeZ";

const ViewsPage: React.FC = () => {
	const params = useParams();
	const [showFilterSaveForm, setShowFilterSaveForm] = useState(false);
	const [filterOption, setFilterOption] = useState<FilterOption | null>(null);
	const { currentTeam } = useTeamStore((state) => state);
	const { tasks, setTaskList, updateTask } = useTaskStore((state) => state);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
	const activeSelected = params.all === "active";
	const backlogSelected = params.all === "backlog";

	const handleFilter = (filterValue: FilterOption | null) => {
		setFilterOption(filterValue);
	};

	const handleFilterSaveForm = (value: boolean) => {
		setShowFilterSaveForm(value);
	};

	const handleDragEnd: OnDragEndResponder = async (result) => {
		const { destination, source, draggableId } = result;

		if (!destination || destination.droppableId === source.droppableId) {
			return;
		}

		const draggedTaskFound = filteredTasks.find(
			(task) => task && task.id === draggableId,
		);

		if (!draggedTaskFound) {
			return;
		}

		const updatedTask = {
			...draggedTaskFound,
			status: destination.droppableId as Status,
		};

		// Update task list in the local state
		const updatedTaskList = filteredTasks.map((task) =>
			task.id === draggableId ? updatedTask : task,
		);

		setFilteredTasks(updatedTaskList);

		// Update task in the backend
		await updateTask(updatedTask.id, { status: updatedTask.status });
	};

	return (
		<div className="flex flex-row overflow-hidden relative">
			<div className="flex items-center flex-col w-full h-screen bg-background">
				<div className="w-full px-8 h-screen snap-x relative">
					<ViewAllTasks
						activeSelected={activeSelected}
						backlogSelected={backlogSelected}
						handleDragEnd={handleDragEnd as OnDragEndResponder}
						tasks={filteredTasks}
					/>
				</div>
			</div>
		</div>
	);
};

export default ViewsPage;
