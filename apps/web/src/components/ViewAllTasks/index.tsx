'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllTasks } from '@/store/taskData/thunks';
import { DragDropContext } from '@hello-pangea/dnd';
import type { OnDragEndResponder } from '@hello-pangea/dnd';
import StatusColumn from '@/components/StatusColumn';
import RenameModal from '@/components/RenameModal';
import { getFilteredTasks } from '@/store/filterPage/actions';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { Status } from '@/interfaces/event.interfaces';
import type { Task } from '@/store/taskData/taskData.interfaces';
import { ScrollArea } from '../ui/scroll-area';

const style = {
  tasksBackgroundGrid: 'flex flex-row h-full w-full snap-start',
  tasksBackgroundList: 'flex flex-col w-full h-full',
};

const ViewAllTasks = ({
  handleDragEnd,
  activeSelected,
  backlogSelected,
}: {
  activeSelected: boolean;
  backlogSelected: boolean;
  handleDragEnd: OnDragEndResponder;
  handleDeleteTask: (taskId: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const view = useSelector((state: RootState) => state.userSettings.view);
  const team = useSelector((state: RootState) => state.taskData.currentTeam);
  const teamId = useSelector((state: RootState) => state.taskData.currentTeam._id);
  const [loading, setLoading] = useState(true);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const taskList = useSelector((state: RootState) => state.taskData.taskList);
  const [showFilteredView, setShowFilteredView] = useState(false);
  const filteredTaskList = useSelector((state: RootState) => state.filterPage.filteredTaskList);
  const currentFilters = useSelector((state: RootState) => state.filterPage.currentFilters);
  const filterType = useSelector((state: RootState) => state.filterPage.filterType);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllTasks(team));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, team]);

  useEffect(() => {
    if (
      currentFilters.priority.length !== 0 ||
      currentFilters.status.length !== 0 ||
      currentFilters.assignee?.length !== 0 ||
      currentFilters.labels.length !== 0 ||
      currentFilters.dueDate.length !== 0 ||
      currentFilters.effortEstimate.length !== 0
    ) {
      const dashboardPage = true;
      const filterId = 'dashboardPage';
      dispatch(getFilteredTasks(teamId, filterId, dashboardPage, filterType));

      setShowFilteredView(true);
    } else {
      setShowFilteredView(false);
    }
  }, [dispatch, teamId, currentFilters, filterType]);

  const titleArr = [
    { value: 'Backlog', id: 1 },
    { value: 'Todo', id: 2 },
    { value: 'In Progress', id: 3 },
    { value: 'Done', id: 4 },
    { value: 'Canceled', id: 5 },
  ];
  const getFilteredStatuses = () => {
    const allStatuses = titleArr.map((t) => t.value);
    if (activeSelected) {
      return allStatuses.filter((status) => status === 'Todo' || status === 'In Progress');
    }
    if (backlogSelected) {
      return allStatuses.filter((status) => status === 'Backlog');
    }
    return allStatuses;
  };

  const getTasksForStatus = (status: Status) => {
    if (!activeSelected && !backlogSelected && showFilteredView) {
      return filteredTaskList.filter((task) => task.status === status);
    }
    return taskList.filter((task) => task.status === status);
  };
  const filteredColumns = () => {
    const filteredStatuses = getFilteredStatuses();
    return filteredStatuses.map((status) => {
      const tasksForStatus = getTasksForStatus(status as Status);
      return (
        <div key={status}>
          <StatusColumn
            key={status}
            columnType={status}
            title={status}
            tasks={tasksForStatus as Task[]}
            setShowRenameModal={setShowRenameModal}
            setTaskData={setTaskData}
          />
        </div>
      );
    });
  };

  return (
    <>
      {!loading && (
        <>
          <RenameModal
            showRenameModal={showRenameModal}
            setShowRenameModal={setShowRenameModal}
            taskData={taskData ? taskData : ({} as Task)}
          />
          <DragDropContext onDragEnd={handleDragEnd}>
            <ScrollArea
              className={` px-8 ${
                view === 'list'
                  ? 'h-[92%] flex items-center justify-center w-full'
                  : 'h-[95%] overflow-x-auto w-[calc(100vw-296px)]'
              }`}
            >
              <div
                className={view === 'list' ? style.tasksBackgroundList : style.tasksBackgroundGrid}
              >
                {view === 'list' ? (
                  <div className="mr-1">{filteredColumns()}</div>
                ) : (
                  filteredColumns()
                )}
              </div>
            </ScrollArea>
          </DragDropContext>
        </>
      )}
    </>
  );
};

export default ViewAllTasks;
